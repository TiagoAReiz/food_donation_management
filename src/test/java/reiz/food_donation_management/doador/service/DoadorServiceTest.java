package reiz.food_donation_management.doador.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import reiz.food_donation_management.common.dto.ExclusaoResponse;
import reiz.food_donation_management.common.exception.ValidacaoException;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.doador.entity.Doador;
import reiz.food_donation_management.doador.entity.TipoPessoa;
import reiz.food_donation_management.doador.repository.DoadorRepository;
import reiz.food_donation_management.usuario.entity.Usuario;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoadorServiceTest {

    @Mock DoadorRepository doadorRepository;
    @Mock UsuarioRepository usuarioRepository;
    @Mock DoacaoRepository doacaoRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks DoadorService service;

    private Doador doador() {
        return Doador.builder().id(1).tipoPessoa(TipoPessoa.FISICA).documento("529.982.247-25")
                .usuario(Usuario.builder().id(10).nome("Maria").ativo(true).build()).build();
    }

    @Test
    void rn08_comDoacoesApenasDesativa() {
        Doador d = doador();
        when(doadorRepository.findByUsuarioId(10)).thenReturn(Optional.of(d));
        when(doacaoRepository.existsByDoadorId(1)).thenReturn(true);

        ExclusaoResponse r = service.excluirPorUsuario(10);

        assertEquals("DESATIVADO", r.resultado());
        assertFalse(d.getUsuario().isAtivo());
        verify(doadorRepository, never()).delete(any());
    }

    @Test
    void rn08_semHistoricoApagaDeVerdade() {
        Doador d = doador();
        when(doadorRepository.findByUsuarioId(10)).thenReturn(Optional.of(d));
        when(doacaoRepository.existsByDoadorId(1)).thenReturn(false);

        ExclusaoResponse r = service.excluirPorUsuario(10);

        assertEquals("EXCLUIDO", r.resultado());
        verify(doadorRepository).delete(d);
    }

    @Test
    void normalizaDocumentoPorTipoDePessoa() {
        assertEquals("529.982.247-25", DoadorService.normalizarDocumento(TipoPessoa.FISICA, "52998224725"));
        assertEquals("11.444.777/0001-61", DoadorService.normalizarDocumento(TipoPessoa.JURIDICA, "11444777000161"));
        assertThrows(ValidacaoException.class, () -> DoadorService.normalizarDocumento(TipoPessoa.FISICA, "11444777000161"));
        assertThrows(ValidacaoException.class, () -> DoadorService.normalizarDocumento(TipoPessoa.JURIDICA, "52998224725"));
    }
}
