package reiz.food_donation_management.painel.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.doacao.entity.SituacaoDoacao;
import reiz.food_donation_management.doacao.repository.AlimentoRepository;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.entidade.repository.EntidadeRepository;
import reiz.food_donation_management.solicitacao.entity.SituacaoSolicitacao;
import reiz.food_donation_management.solicitacao.repository.SolicitacaoRepository;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PainelService {

    private final DoacaoRepository doacaoRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final EntidadeRepository entidadeRepository;
    private final AlimentoRepository alimentoRepository;

    /** Cada perfil recebe apenas os indicadores que lhe dizem respeito. */
    public Map<String, Object> resumo(UsuarioLogado usuario) {
        LocalDate hoje = DataUtil.hoje();
        Map<String, Object> painel = new LinkedHashMap<>();
        switch (usuario.perfil()) {
            case ADMINISTRADOR -> {
                painel.put("doacoesPendentes", doacaoRepository.countBySituacao(SituacaoDoacao.PENDENTE));
                painel.put("solicitacoesPendentes", solicitacaoRepository.countBySituacao(SituacaoSolicitacao.PENDENTE));
                painel.put("solicitacoesAprovadas", solicitacaoRepository.countBySituacao(SituacaoSolicitacao.APROVADA));
                painel.put("entidadesPendentes", entidadeRepository.countByAprovadaFalseAndUsuarioAtivoTrue());
                painel.put("lotesEmEstoque", alimentoRepository.countEstoque(hoje));
                painel.put("lotesVencidos", alimentoRepository.countVencidos(hoje));
                painel.put("lotesVencendo7Dias", alimentoRepository.countVencendo(hoje, hoje.plusDays(7)));
            }
            case DOADOR -> {
                Integer id = usuario.id();
                painel.put("doacoesPendentes", doacaoRepository.countByDoadorUsuarioIdAndSituacao(id, SituacaoDoacao.PENDENTE));
                painel.put("doacoesRecebidas", doacaoRepository.countByDoadorUsuarioIdAndSituacao(id, SituacaoDoacao.RECEBIDA));
                painel.put("totalDoacoes", doacaoRepository.countByDoadorUsuarioId(id));
                painel.put("lotesAindaEmEstoque", alimentoRepository.countEstoqueDoDoador(id, hoje));
            }
            case ENTIDADE -> {
                Integer id = usuario.id();
                boolean aprovada = entidadeRepository.findByUsuarioId(id).map(e -> e.isAprovada()).orElse(false);
                painel.put("aprovada", aprovada);
                painel.put("solicitacoesPendentes", solicitacaoRepository.countByEntidadeUsuarioIdAndSituacao(id, SituacaoSolicitacao.PENDENTE));
                painel.put("solicitacoesAprovadas", solicitacaoRepository.countByEntidadeUsuarioIdAndSituacao(id, SituacaoSolicitacao.APROVADA));
                painel.put("solicitacoesEntregues", solicitacaoRepository.countByEntidadeUsuarioIdAndSituacao(id, SituacaoSolicitacao.ENTREGUE));
                painel.put("lotesDisponiveis", alimentoRepository.countEstoque(hoje));
            }
        }
        return painel;
    }
}
