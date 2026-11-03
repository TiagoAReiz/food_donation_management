package reiz.food_donation_management.doacao.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.exception.NaoEncontradoException;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.doacao.dto.*;
import reiz.food_donation_management.doacao.entity.Alimento;
import reiz.food_donation_management.doacao.entity.Doacao;
import reiz.food_donation_management.doacao.entity.SituacaoDoacao;
import reiz.food_donation_management.doacao.repository.AlimentoRepository;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.doador.repository.DoadorRepository;
import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class DoacaoService {

    static final String MSG_NAO_PENDENTE = "Esta doação não está mais pendente e não pode ser alterada.";

    private final DoacaoRepository doacaoRepository;
    private final AlimentoRepository alimentoRepository;
    private final DoadorRepository doadorRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<DoacaoResponse> minhas(Integer usuarioId) {
        return doacaoRepository.findByDoadorUsuarioIdOrderByIdDesc(usuarioId).stream().map(DoacaoResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public List<MeuAlimentoResponse> meusAlimentos(Integer usuarioId) {
        return alimentoRepository.findDoDoador(usuarioId).stream().map(MeuAlimentoResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public List<DoacaoResponse> listar(SituacaoDoacao situacao) {
        List<Doacao> lista;
        if (situacao == null) {
            lista = doacaoRepository.findAllByOrderByIdDesc();
        } else if (situacao == SituacaoDoacao.PENDENTE) {
            lista = doacaoRepository.findBySituacaoOrderByIdAsc(situacao);
        } else {
            lista = doacaoRepository.findBySituacaoOrderByIdDesc(situacao);
        }
        return lista.stream().map(DoacaoResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public DoacaoResponse buscar(UsuarioLogado usuario, Integer id) {
        Doacao doacao = usuario.perfil() == Perfil.ADMINISTRADOR
                ? doacaoRepository.findById(id).orElseThrow(NaoEncontradoException::new)
                : propria(usuario.id(), id);
        return DoacaoResponse.of(doacao);
    }

    /** RN02 (validade) e RN04 (qtdDisponivel começa em 0). */
    public DoacaoResponse criar(Integer usuarioId, DoacaoRequest req) {
        var doador = doadorRepository.findByUsuarioId(usuarioId).orElseThrow(NaoEncontradoException::new);
        validarValidades(req);
        Doacao doacao = Doacao.builder()
                .doador(doador)
                .dataDoacao(DataUtil.hoje())
                .situacao(SituacaoDoacao.PENDENTE)
                .observacao(req.observacao())
                .build();
        adicionarAlimentos(doacao, req);
        return DoacaoResponse.of(doacaoRepository.save(doacao));
    }

    /** RN03: só doação pendente pode ser editada. */
    public DoacaoResponse atualizar(Integer usuarioId, Integer id, DoacaoRequest req) {
        Doacao doacao = propria(usuarioId, id);
        exigirPendente(doacao, MSG_NAO_PENDENTE);
        validarValidades(req);
        doacao.setObservacao(req.observacao());
        doacao.getAlimentos().clear();
        adicionarAlimentos(doacao, req);
        return DoacaoResponse.of(doacaoRepository.save(doacao));
    }

    /** RN03: só doação pendente pode ser cancelada. */
    public DoacaoResponse cancelar(Integer usuarioId, Integer id) {
        Doacao doacao = propria(usuarioId, id);
        exigirPendente(doacao, MSG_NAO_PENDENTE);
        doacao.setSituacao(SituacaoDoacao.CANCELADA);
        return DoacaoResponse.of(doacaoRepository.save(doacao));
    }

    /** RN04: os alimentos só entram no estoque na confirmação do administrador. */
    public DoacaoResponse confirmar(Integer adminId, Integer id, ConfirmarDoacaoRequest req) {
        Doacao doacao = doacaoRepository.findByIdForUpdate(id).orElseThrow(NaoEncontradoException::new);
        exigirPendente(doacao, "Esta doação não está pendente.");

        Map<Integer, Alimento> porId = new HashMap<>();
        doacao.getAlimentos().forEach(a -> porId.put(a.getId(), a));
        if (req != null && req.alimentos() != null) {
            for (var correcao : req.alimentos()) {
                Alimento alimento = porId.get(correcao.id());
                if (alimento == null) {
                    throw new NegocioException("O alimento " + correcao.id() + " não pertence a esta doação.");
                }
                alimento.setQuantidade(correcao.quantidade());
            }
        }
        LocalDate hoje = DataUtil.hoje();
        for (Alimento alimento : doacao.getAlimentos()) {
            if (alimento.getValidade().isBefore(hoje)) {
                throw new NegocioException("Não é possível receber alimento vencido: " + alimento.getNome() + ".");
            }
            alimento.setQtdDisponivel(alimento.getQuantidade());
        }
        doacao.setSituacao(SituacaoDoacao.RECEBIDA);
        doacao.setRecebidaEm(DataUtil.agora());
        doacao.setRecebidaPor(usuarioRepository.getReferenceById(adminId));
        return DoacaoResponse.of(doacaoRepository.save(doacao));
    }

    public DoacaoResponse recusar(Integer adminId, Integer id, String motivo) {
        Doacao doacao = doacaoRepository.findByIdForUpdate(id).orElseThrow(NaoEncontradoException::new);
        exigirPendente(doacao, "Esta doação não está pendente.");
        doacao.setSituacao(SituacaoDoacao.RECUSADA);
        doacao.setObservacao(motivo);
        doacao.setRecebidaEm(DataUtil.agora());
        doacao.setRecebidaPor(usuarioRepository.getReferenceById(adminId));
        return DoacaoResponse.of(doacaoRepository.save(doacao));
    }

    private Doacao propria(Integer usuarioId, Integer id) {
        return doacaoRepository.findByIdAndDoadorUsuarioId(id, usuarioId).orElseThrow(NaoEncontradoException::new);
    }

    private void exigirPendente(Doacao doacao, String mensagem) {
        if (doacao.getSituacao() != SituacaoDoacao.PENDENTE) {
            throw new NegocioException(mensagem);
        }
    }

    private void validarValidades(DoacaoRequest req) {
        LocalDate hoje = DataUtil.hoje();
        for (var a : req.alimentos()) {
            if (a.validade().isBefore(hoje)) {
                throw new NegocioException("Não é possível doar alimento vencido: " + a.nome() + ".");
            }
        }
    }

    private void adicionarAlimentos(Doacao doacao, DoacaoRequest req) {
        for (var a : req.alimentos()) {
            doacao.adicionarAlimento(Alimento.builder()
                    .nome(a.nome().trim())
                    .categoria(a.categoria())
                    .quantidade(a.quantidade())
                    .unidade(a.unidade())
                    .validade(a.validade())
                    .qtdDisponivel(BigDecimal.ZERO)
                    .build());
        }
    }
}
