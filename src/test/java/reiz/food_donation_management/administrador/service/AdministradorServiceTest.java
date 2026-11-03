package reiz.food_donation_management.administrador.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.solicitacao.repository.SolicitacaoRepository;
import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.entity.Usuario;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdministradorServiceTest {

    @Mock UsuarioRepository usuarioRepository;
    @Mock DoacaoRepository doacaoRepository;
    @Mock SolicitacaoRepository solicitacaoRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AdministradorService service;

    private Usuario admin(int id) {
        return Usuario.builder().id(id).nome("Admin " + id).perfil(Perfil.ADMINISTRADOR).ativo(true).build();
    }

    @Test
    void naoExcluiASiMesmo() {
        when(usuarioRepository.findByIdAndPerfil(1, Perfil.ADMINISTRADOR)).thenReturn(Optional.of(admin(1)));
        assertThrows(NegocioException.class, () -> service.excluir(1, 1));
    }

    @Test
    void naoExcluiUltimoAdminAtivo() {
        when(usuarioRepository.findByIdAndPerfil(2, Perfil.ADMINISTRADOR)).thenReturn(Optional.of(admin(2)));
        when(usuarioRepository.countByPerfilAndAtivoTrue(Perfil.ADMINISTRADOR)).thenReturn(1L);

        var e = assertThrows(NegocioException.class, () -> service.excluir(1, 2));

        assertEquals("Não é possível excluir o último administrador.", e.getMessage());
    }

    @Test
    void rn08_adminComHistoricoEDesativado() {
        Usuario alvo = admin(2);
        when(usuarioRepository.findByIdAndPerfil(2, Perfil.ADMINISTRADOR)).thenReturn(Optional.of(alvo));
        when(usuarioRepository.countByPerfilAndAtivoTrue(Perfil.ADMINISTRADOR)).thenReturn(2L);
        when(doacaoRepository.existsByRecebidaPorId(2)).thenReturn(true);

        assertEquals("DESATIVADO", service.excluir(1, 2).resultado());
        assertFalse(alvo.isAtivo());
        verify(usuarioRepository, never()).delete(any());
    }

    @Test
    void rn08_adminSemHistoricoEApagado() {
        Usuario alvo = admin(2);
        when(usuarioRepository.findByIdAndPerfil(2, Perfil.ADMINISTRADOR)).thenReturn(Optional.of(alvo));
        when(usuarioRepository.countByPerfilAndAtivoTrue(Perfil.ADMINISTRADOR)).thenReturn(2L);
        when(doacaoRepository.existsByRecebidaPorId(2)).thenReturn(false);
        when(solicitacaoRepository.existsByAvaliadaPorId(2)).thenReturn(false);

        assertEquals("EXCLUIDO", service.excluir(1, 2).resultado());
        verify(usuarioRepository).delete(alvo);
    }
}
