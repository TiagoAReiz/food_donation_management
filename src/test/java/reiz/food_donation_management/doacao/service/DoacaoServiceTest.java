package reiz.food_donation_management.doacao.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.doacao.dto.AlimentoRequest;
import reiz.food_donation_management.doacao.dto.ConfirmarDoacaoRequest;
import reiz.food_donation_management.doacao.dto.DoacaoRequest;
import reiz.food_donation_management.doacao.dto.DoacaoResponse;
import reiz.food_donation_management.doacao.entity.*;
import reiz.food_donation_management.doacao.repository.AlimentoRepository;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.doador.entity.Doador;
import reiz.food_donation_management.doador.repository.DoadorRepository;
import reiz.food_donation_management.usuario.entity.Usuario;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoacaoServiceTest {

    @Mock DoacaoRepository doacaoRepository;
    @Mock AlimentoRepository alimentoRepository;
    @Mock DoadorRepository doadorRepository;
    @Mock UsuarioRepository usuarioRepository;
    @InjectMocks DoacaoService service;

    private Doador doador() {
        return Doador.builder().id(1)
                .usuario(Usuario.builder().id(10).nome("Mercado").build()).build();
    }

    private AlimentoRequest alimento(LocalDate validade) {
        return new AlimentoRequest("Leite", Categoria.LATICINIOS, new BigDecimal("2"), Unidade.L, validade);
    }

    private Doacao doacao(SituacaoDoacao situacao, int idAlimento, String qtd, LocalDate validade) {
        Doacao d = Doacao.builder().id(5).doador(doador()).dataDoacao(DataUtil.hoje()).situacao(situacao).build();
        d.adicionarAlimento(Alimento.builder().id(idAlimento).nome("Arroz").categoria(Categoria.GRAOS)
                .quantidade(new BigDecimal(qtd)).unidade(Unidade.KG).validade(validade)
                .qtdDisponivel(BigDecimal.ZERO).build());
        return d;
    }

    @Test
    void rn02_rejeitaAlimentoVencido() {
        when(doadorRepository.findByUsuarioId(10)).thenReturn(Optional.of(doador()));
        var req = new DoacaoRequest(null, List.of(alimento(DataUtil.hoje().minusDays(1))));

        var e = assertThrows(NegocioException.class, () -> service.criar(10, req));

        assertEquals("Não é possível doar alimento vencido: Leite.", e.getMessage());
        verify(doacaoRepository, never()).save(any());
    }

    @Test
    void rn02_aceitaValidadeDeHoje_eRn04QuantidadeDisponivelZero() {
        when(doadorRepository.findByUsuarioId(10)).thenReturn(Optional.of(doador()));
        when(doacaoRepository.save(any(Doacao.class))).thenAnswer(i -> i.getArgument(0));

        DoacaoResponse resp = service.criar(10, new DoacaoRequest("obs", List.of(alimento(DataUtil.hoje()))));

        assertEquals(SituacaoDoacao.PENDENTE, resp.situacao());
        assertEquals(0, resp.alimentos().get(0).qtdDisponivel().compareTo(BigDecimal.ZERO));
    }

    @Test
    void rn03_naoEditaDoacaoRecebida() {
        when(doacaoRepository.findByIdAndDoadorUsuarioId(5, 10))
                .thenReturn(Optional.of(doacao(SituacaoDoacao.RECEBIDA, 1, "5", DataUtil.hoje().plusDays(10))));
        var req = new DoacaoRequest(null, List.of(alimento(DataUtil.hoje().plusDays(3))));

        var e = assertThrows(NegocioException.class, () -> service.atualizar(10, 5, req));

        assertEquals("Esta doação não está mais pendente e não pode ser alterada.", e.getMessage());
    }

    @Test
    void rn03_naoCancelaDoacaoRecebida_masCancelaPendente() {
        when(doacaoRepository.findByIdAndDoadorUsuarioId(5, 10))
                .thenReturn(Optional.of(doacao(SituacaoDoacao.RECEBIDA, 1, "5", DataUtil.hoje().plusDays(10))));
        assertThrows(NegocioException.class, () -> service.cancelar(10, 5));

        Doacao pendente = doacao(SituacaoDoacao.PENDENTE, 1, "5", DataUtil.hoje().plusDays(10));
        when(doacaoRepository.findByIdAndDoadorUsuarioId(6, 10)).thenReturn(Optional.of(pendente));
        when(doacaoRepository.save(any(Doacao.class))).thenAnswer(i -> i.getArgument(0));

        assertEquals(SituacaoDoacao.CANCELADA, service.cancelar(10, 6).situacao());
    }

    @Test
    void rn04_confirmarAplicaCorrecaoEColocaNoEstoque() {
        Doacao d = doacao(SituacaoDoacao.PENDENTE, 7, "5", DataUtil.hoje().plusDays(30));
        when(doacaoRepository.findByIdForUpdate(5)).thenReturn(Optional.of(d));
        when(doacaoRepository.save(any(Doacao.class))).thenAnswer(i -> i.getArgument(0));

        var req = new ConfirmarDoacaoRequest(List.of(new ConfirmarDoacaoRequest.Correcao(7, new BigDecimal("4"))));
        DoacaoResponse resp = service.confirmar(1, 5, req);

        assertEquals(SituacaoDoacao.RECEBIDA, resp.situacao());
        assertEquals(new BigDecimal("4"), resp.alimentos().get(0).quantidade());
        assertEquals(new BigDecimal("4"), resp.alimentos().get(0).qtdDisponivel());
        assertNotNull(resp.recebidaEm());
    }

    @Test
    void confirmarSoDoacaoPendente() {
        when(doacaoRepository.findByIdForUpdate(5))
                .thenReturn(Optional.of(doacao(SituacaoDoacao.CANCELADA, 7, "5", DataUtil.hoje().plusDays(30))));
        assertThrows(NegocioException.class, () -> service.confirmar(1, 5, null));
    }

    @Test
    void rn02_confirmarRejeitaLoteQueVenceuAntesDoRecebimento() {
        when(doacaoRepository.findByIdForUpdate(5))
                .thenReturn(Optional.of(doacao(SituacaoDoacao.PENDENTE, 7, "5", DataUtil.hoje().minusDays(1))));
        assertThrows(NegocioException.class, () -> service.confirmar(1, 5, null));
    }

    @Test
    void recusarGravaMotivoEMantemEstoqueZerado() {
        Doacao d = doacao(SituacaoDoacao.PENDENTE, 7, "5", DataUtil.hoje().plusDays(30));
        when(doacaoRepository.findByIdForUpdate(5)).thenReturn(Optional.of(d));
        when(doacaoRepository.save(any(Doacao.class))).thenAnswer(i -> i.getArgument(0));

        DoacaoResponse resp = service.recusar(1, 5, "Não chegou");

        assertEquals(SituacaoDoacao.RECUSADA, resp.situacao());
        assertEquals("Não chegou", resp.observacao());
        assertEquals(0, resp.alimentos().get(0).qtdDisponivel().compareTo(BigDecimal.ZERO));
    }
}
