package reiz.food_donation_management.solicitacao.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.exception.NaoEncontradoException;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.common.util.Quantidades;
import reiz.food_donation_management.doacao.entity.Alimento;
import reiz.food_donation_management.doacao.repository.AlimentoRepository;
import reiz.food_donation_management.entidade.repository.EntidadeRepository;
import reiz.food_donation_management.solicitacao.dto.SolicitacaoRequest;
import reiz.food_donation_management.solicitacao.dto.SolicitacaoResponse;
import reiz.food_donation_management.solicitacao.entity.ItemSolicitacao;
import reiz.food_donation_management.solicitacao.entity.SituacaoSolicitacao;
import reiz.food_donation_management.solicitacao.entity.Solicitacao;
import reiz.food_donation_management.solicitacao.repository.SolicitacaoRepository;
import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SolicitacaoService {

    static final String MSG_RN05 = "Seu cadastro ainda está aguardando aprovação. "
            + "Você poderá solicitar alimentos assim que for aprovado.";
    static final String MSG_NAO_PENDENTE = "Esta solicitação não está mais pendente e não pode ser alterada.";

    private final SolicitacaoRepository solicitacaoRepository;
    private final AlimentoRepository alimentoRepository;
    private final EntidadeRepository entidadeRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> minhas(Integer usuarioId) {
        return solicitacaoRepository.findByEntidadeUsuarioIdOrderByIdDesc(usuarioId).stream()
                .map(SolicitacaoResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listar(SituacaoSolicitacao situacao) {
        List<Solicitacao> lista;
        if (situacao == null) {
            lista = solicitacaoRepository.findAllByOrderByIdDesc();
        } else if (situacao == SituacaoSolicitacao.PENDENTE) {
            lista = solicitacaoRepository.findBySituacaoOrderByIdAsc(situacao);
        } else {
            lista = solicitacaoRepository.findBySituacaoOrderByIdDesc(situacao);
        }
        return lista.stream().map(SolicitacaoResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponse buscar(UsuarioLogado usuario, Integer id) {
        Solicitacao s = usuario.perfil() == Perfil.ADMINISTRADOR
                ? solicitacaoRepository.findById(id).orElseThrow(NaoEncontradoException::new)
                : propria(usuario.id(), id);
        return SolicitacaoResponse.of(s);
    }

    /** RN05: só entidade aprovada solicita. */
    public SolicitacaoResponse criar(Integer usuarioId, SolicitacaoRequest req) {
        var entidade = entidadeRepository.findByUsuarioId(usuarioId).orElseThrow(NaoEncontradoException::new);
        if (!entidade.isAprovada()) {
            throw new NegocioException(MSG_RN05);
        }
        Solicitacao solicitacao = Solicitacao.builder()
                .entidade(entidade)
                .dataSolicitacao(DataUtil.hoje())
                .situacao(SituacaoSolicitacao.PENDENTE)
                .build();
        montarItens(solicitacao, req);
        return SolicitacaoResponse.of(solicitacaoRepository.save(solicitacao));
    }

    public SolicitacaoResponse atualizar(Integer usuarioId, Integer id, SolicitacaoRequest req) {
        Solicitacao solicitacao = propria(usuarioId, id);
        exigirSituacao(solicitacao, SituacaoSolicitacao.PENDENTE, MSG_NAO_PENDENTE);
        solicitacao.getItens().clear();
        // descarrega as remoções antes de reinserir, por causa do UNIQUE (solicitacao_id, alimento_id)
        solicitacaoRepository.saveAndFlush(solicitacao);
        montarItens(solicitacao, req);
        return SolicitacaoResponse.of(solicitacaoRepository.save(solicitacao));
    }

    public SolicitacaoResponse cancelar(Integer usuarioId, Integer id) {
        Solicitacao solicitacao = propria(usuarioId, id);
        exigirSituacao(solicitacao, SituacaoSolicitacao.PENDENTE, MSG_NAO_PENDENTE);
        solicitacao.setSituacao(SituacaoSolicitacao.CANCELADA);
        return SolicitacaoResponse.of(solicitacaoRepository.save(solicitacao));
    }

    /**
     * RN06: cada item precisa caber na quantidade livre do lote (disponível - reservada).
     * Ao aprovar, a quantidade fica reservada para este pedido e some do que as entidades podem pedir.
     */
    public SolicitacaoResponse aprovar(Integer adminId, Integer id) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdForUpdate(id).orElseThrow(NaoEncontradoException::new);
        exigirSituacao(solicitacao, SituacaoSolicitacao.PENDENTE, "Esta solicitação não está pendente.");

        Map<Integer, Alimento> lotes = travarLotes(solicitacao);
        verificarItens(solicitacao, lotes, Alimento::getQtdLivre);
        for (ItemSolicitacao item : solicitacao.getItens()) {
            Alimento lote = lotes.get(item.getAlimento().getId());
            lote.setQtdReservada(lote.getQtdReservada().add(item.getQuantidade()));
        }
        solicitacao.setSituacao(SituacaoSolicitacao.APROVADA);
        solicitacao.setAvaliadaPor(usuarioRepository.getReferenceById(adminId));
        return SolicitacaoResponse.of(solicitacaoRepository.save(solicitacao));
    }

    /** Recusa um pedido pendente ou aprovado; se estava aprovado, libera a reserva. */
    public SolicitacaoResponse recusar(Integer adminId, Integer id, String motivo) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdForUpdate(id).orElseThrow(NaoEncontradoException::new);
        if (solicitacao.getSituacao() != SituacaoSolicitacao.PENDENTE
                && solicitacao.getSituacao() != SituacaoSolicitacao.APROVADA) {
            throw new NegocioException("Só é possível recusar solicitações pendentes ou aprovadas.");
        }
        if (solicitacao.getSituacao() == SituacaoSolicitacao.APROVADA) {
            Map<Integer, Alimento> lotes = travarLotes(solicitacao);
            for (ItemSolicitacao item : solicitacao.getItens()) {
                Alimento lote = lotes.get(item.getAlimento().getId());
                lote.setQtdReservada(lote.getQtdReservada().subtract(item.getQuantidade()).max(BigDecimal.ZERO));
            }
        }
        solicitacao.setSituacao(SituacaoSolicitacao.RECUSADA);
        solicitacao.setMotivoRecusa(motivo);
        solicitacao.setAvaliadaPor(usuarioRepository.getReferenceById(adminId));
        return SolicitacaoResponse.of(solicitacaoRepository.save(solicitacao));
    }

    /** Entrega consome a reserva: baixa no estoque físico e libera a quantidade reservada. */
    public SolicitacaoResponse entregar(Integer id) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdForUpdate(id).orElseThrow(NaoEncontradoException::new);
        exigirSituacao(solicitacao, SituacaoSolicitacao.APROVADA, "Somente solicitações aprovadas podem ser entregues.");

        Map<Integer, Alimento> lotes = travarLotes(solicitacao);
        // a reserva garante a quantidade; só falha se o lote foi retirado/corrigido depois da aprovação
        verificarItens(solicitacao, lotes, Alimento::getQtdReservada);

        for (ItemSolicitacao item : solicitacao.getItens()) {
            Alimento lote = lotes.get(item.getAlimento().getId());
            lote.setQtdReservada(lote.getQtdReservada().subtract(item.getQuantidade()));
            lote.setQtdDisponivel(lote.getQtdDisponivel().subtract(item.getQuantidade()));
        }
        solicitacao.setSituacao(SituacaoSolicitacao.ENTREGUE);
        solicitacao.setDataEntrega(DataUtil.hoje());
        return SolicitacaoResponse.of(solicitacaoRepository.save(solicitacao));
    }

    /** Lock pessimista nos lotes do pedido, sempre na mesma ordem (por id) para evitar deadlock. */
    private Map<Integer, Alimento> travarLotes(Solicitacao solicitacao) {
        Set<Integer> ids = solicitacao.getItens().stream()
                .map(i -> i.getAlimento().getId()).collect(Collectors.toCollection(TreeSet::new));
        return alimentoRepository.findAllByIdForUpdate(ids).stream()
                .collect(Collectors.toMap(Alimento::getId, Function.identity()));
    }

    private void verificarItens(Solicitacao solicitacao, Map<Integer, Alimento> lotes,
                                Function<Alimento, BigDecimal> limite) {
        LocalDate hoje = DataUtil.hoje();
        List<String> erros = new ArrayList<>();
        for (ItemSolicitacao item : solicitacao.getItens()) {
            Alimento lote = lotes.get(item.getAlimento().getId());
            if (lote == null) {
                erros.add("O lote " + item.getAlimento().getNome() + " não está mais disponível.");
            } else if (lote.getValidade().isBefore(hoje)) {
                erros.add("O lote " + lote.getNome() + " está vencido.");
            } else if (item.getQuantidade().compareTo(limite.apply(lote)) > 0) {
                erros.add(mensagemQuantidade(lote, item.getQuantidade(), limite.apply(lote)));
            }
        }
        if (!erros.isEmpty()) {
            throw new NegocioException(String.join(" ", erros));
        }
    }

    private void montarItens(Solicitacao solicitacao, SolicitacaoRequest req) {
        LocalDate hoje = DataUtil.hoje();
        Set<Integer> vistos = new HashSet<>();
        for (var item : req.itens()) {
            if (!vistos.add(item.alimentoId())) {
                throw new NegocioException("O mesmo alimento não pode aparecer duas vezes na solicitação.");
            }
            Alimento lote = alimentoRepository.findDisponivelById(item.alimentoId(), hoje)
                    .orElseThrow(() -> new NegocioException(
                            "O alimento " + item.alimentoId() + " não está disponível no estoque."));
            if (item.quantidade().compareTo(lote.getQtdLivre()) > 0) {
                throw new NegocioException(mensagemQuantidade(lote, item.quantidade(), lote.getQtdLivre()));
            }
            solicitacao.adicionarItem(ItemSolicitacao.builder().alimento(lote).quantidade(item.quantidade()).build());
        }
    }

    private String mensagemQuantidade(Alimento lote, BigDecimal pedida, BigDecimal disponivel) {
        String unidade = lote.getUnidade().name().toLowerCase();
        return "Quantidade pedida de " + lote.getNome() + " (" + Quantidades.texto(pedida) + " " + unidade
                + ") maior que a disponível (" + Quantidades.texto(disponivel) + " " + unidade + ").";
    }

    private Solicitacao propria(Integer usuarioId, Integer id) {
        return solicitacaoRepository.findByIdAndEntidadeUsuarioId(id, usuarioId)
                .orElseThrow(NaoEncontradoException::new);
    }

    private void exigirSituacao(Solicitacao s, SituacaoSolicitacao esperada, String mensagem) {
        if (s.getSituacao() != esperada) {
            throw new NegocioException(mensagem);
        }
    }
}
