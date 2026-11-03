package reiz.food_donation_management.solicitacao.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.doacao.entity.Alimento;
import reiz.food_donation_management.doacao.entity.Categoria;
import reiz.food_donation_management.doacao.entity.Unidade;
import reiz.food_donation_management.doacao.repository.AlimentoRepository;
import reiz.food_donation_management.entidade.entity.Entidade;
import reiz.food_donation_management.entidade.repository.EntidadeRepository;
import reiz.food_donation_management.solicitacao.dto.SolicitacaoRequest;
import reiz.food_donation_management.solicitacao.dto.SolicitacaoResponse;
import reiz.food_donation_management.solicitacao.entity.ItemSolicitacao;
import reiz.food_donation_management.solicitacao.entity.SituacaoSolicitacao;
import reiz.food_donation_management.solicitacao.entity.Solicitacao;
import reiz.food_donation_management.solicitacao.repository.SolicitacaoRepository;
import reiz.food_donation_management.usuario.entity.Usuario;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitacaoServiceTest {

    @Mock SolicitacaoRepository solicitacaoRepository;
    @Mock AlimentoRepository alimentoRepository;
    @Mock EntidadeRepository entidadeRepository;
    @Mock UsuarioRepository usuarioRepository;
    @InjectMocks SolicitacaoService service;

    private Entidade entidade(boolean aprovada) {
        return Entidade.builder().id(1).aprovada(aprovada)
                .usuario(Usuario.builder().id(20).nome("Creche").build()).build();
    }

    private Alimento arroz(String disponivel, LocalDate validade) {
        return Alimento.builder().id(3).nome("Arroz").categoria(Categoria.GRAOS).unidade(Unidade.KG)
                .quantidade(new BigDecimal("20")).qtdDisponivel(new BigDecimal(disponivel)).validade(validade).build();
    }

    private Solicitacao solicitacao(SituacaoSolicitacao situacao, Alimento lote, String pedida) {
        Solicitacao s = Solicitacao.builder().id(9).entidade(entidade(true))
                .dataSolicitacao(DataUtil.hoje()).situacao(situacao).build();
        s.adicionarItem(ItemSolicitacao.builder().id(1).alimento(lote).quantidade(new BigDecimal(pedida)).build());
        return s;
    }

    @Test
    void rn05_entidadeNaoAprovadaNaoSolicita() {
        when(entidadeRepository.findByUsuarioId(20)).thenReturn(Optional.of(entidade(false)));
        var req = new SolicitacaoRequest(List.of(new SolicitacaoRequest.Item(3, BigDecimal.ONE)));

        var e = assertThrows(NegocioException.class, () -> service.criar(20, req));

        assertTrue(e.getMessage().startsWith("Seu cadastro ainda está aguardando aprovação."));
        verify(solicitacaoRepository, never()).save(any());
    }

    @Test
    void criaSolicitacaoPendenteQuandoAprovadaEQuantidadeCabe() {
        when(entidadeRepository.findByUsuarioId(20)).thenReturn(Optional.of(entidade(true)));
        when(alimentoRepository.findDisponivelById(eq3(), any())).thenReturn(Optional.of(arroz("10", DataUtil.hoje().plusDays(5))));
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenAnswer(i -> i.getArgument(0));

        var resp = service.criar(20, new SolicitacaoRequest(List.of(new SolicitacaoRequest.Item(3, new BigDecimal("4")))));

        assertEquals(SituacaoSolicitacao.PENDENTE, resp.situacao());
        assertEquals(1, resp.itens().size());
    }

    @Test
    void rejeitaItemRepetidoEQuantidadeAcimaDoDisponivel() {
        when(entidadeRepository.findByUsuarioId(20)).thenReturn(Optional.of(entidade(true)));
        when(alimentoRepository.findDisponivelById(eq3(), any())).thenReturn(Optional.of(arroz("10", DataUtil.hoje().plusDays(5))));

        var repetido = new SolicitacaoRequest(List.of(new SolicitacaoRequest.Item(3, BigDecimal.ONE),
                new SolicitacaoRequest.Item(3, BigDecimal.ONE)));
        assertThrows(NegocioException.class, () -> service.criar(20, repetido));

        var acima = new SolicitacaoRequest(List.of(new SolicitacaoRequest.Item(3, new BigDecimal("15"))));
        var e = assertThrows(NegocioException.class, () -> service.criar(20, acima));
        assertEquals("Quantidade pedida de Arroz (15 kg) maior que a disponível (10 kg).", e.getMessage());
    }

    @Test
    void rn06_naoAprovaQuandoPedidoMaiorQueDisponivel() {
        Solicitacao s = solicitacao(SituacaoSolicitacao.PENDENTE, arroz("10", DataUtil.hoje().plusDays(5)), "15");
        when(solicitacaoRepository.findByIdForUpdate(9)).thenReturn(Optional.of(s));

        var e = assertThrows(NegocioException.class, () -> service.aprovar(1, 9));

        assertEquals("Quantidade pedida de Arroz (15 kg) maior que a disponível (10 kg).", e.getMessage());
        assertEquals(SituacaoSolicitacao.PENDENTE, s.getSituacao());
    }

    @Test
    void rn06_naoAprovaLoteVencido() {
        Solicitacao s = solicitacao(SituacaoSolicitacao.PENDENTE, arroz("10", DataUtil.hoje().minusDays(1)), "5");
        when(solicitacaoRepository.findByIdForUpdate(9)).thenReturn(Optional.of(s));

        var e = assertThrows(NegocioException.class, () -> service.aprovar(1, 9));

        assertTrue(e.getMessage().contains("vencido"));
    }

    @Test
    void aprovaQuandoTudoCabe() {
        Solicitacao s = solicitacao(SituacaoSolicitacao.PENDENTE, arroz("10", DataUtil.hoje().plusDays(5)), "10");
        when(solicitacaoRepository.findByIdForUpdate(9)).thenReturn(Optional.of(s));
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenAnswer(i -> i.getArgument(0));

        assertEquals(SituacaoSolicitacao.APROVADA, service.aprovar(1, 9).situacao());
    }

    @Test
    void rn06_entregaRevalidaComLockEBloqueiaSeFaltar() {
        Alimento lote = arroz("3", DataUtil.hoje().plusDays(5));
        Solicitacao s = solicitacao(SituacaoSolicitacao.APROVADA, lote, "5");
        when(solicitacaoRepository.findByIdForUpdate(9)).thenReturn(Optional.of(s));
        when(alimentoRepository.findAllByIdForUpdate(anyCollection())).thenReturn(List.of(lote));

        var e = assertThrows(NegocioException.class, () -> service.entregar(9));

        assertEquals("Quantidade pedida de Arroz (5 kg) maior que a disponível (3 kg).", e.getMessage());
        assertEquals(new BigDecimal("3"), lote.getQtdDisponivel());
        assertEquals(SituacaoSolicitacao.APROVADA, s.getSituacao());
    }

    @Test
    void entregaDaBaixaNoEstoque() {
        Alimento lote = arroz("10", DataUtil.hoje().plusDays(5));
        Solicitacao s = solicitacao(SituacaoSolicitacao.APROVADA, lote, "4");
        when(solicitacaoRepository.findByIdForUpdate(9)).thenReturn(Optional.of(s));
        when(alimentoRepository.findAllByIdForUpdate(anyCollection())).thenReturn(List.of(lote));
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenAnswer(i -> i.getArgument(0));

        SolicitacaoResponse resp = service.entregar(9);

        assertEquals(SituacaoSolicitacao.ENTREGUE, resp.situacao());
        assertEquals(DataUtil.hoje(), resp.dataEntrega());
        assertEquals(0, new BigDecimal("6").compareTo(lote.getQtdDisponivel()));
    }

    @Test
    void entregaSoSolicitacaoAprovada() {
        Solicitacao s = solicitacao(SituacaoSolicitacao.PENDENTE, arroz("10", DataUtil.hoje().plusDays(5)), "4");
        when(solicitacaoRepository.findByIdForUpdate(9)).thenReturn(Optional.of(s));

        assertThrows(NegocioException.class, () -> service.entregar(9));
        verify(alimentoRepository, never()).findAllByIdForUpdate(anyCollection());
    }

    private static Integer eq3() {
        return org.mockito.ArgumentMatchers.eq(3);
    }
}
