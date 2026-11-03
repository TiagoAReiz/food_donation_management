package reiz.food_donation_management.administrador.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.administrador.dto.AdministradorRequest;
import reiz.food_donation_management.administrador.dto.UsuarioResponse;
import reiz.food_donation_management.common.dto.ExclusaoResponse;
import reiz.food_donation_management.common.exception.ConflitoException;
import reiz.food_donation_management.common.exception.NaoEncontradoException;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.exception.ValidacaoException;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.solicitacao.repository.SolicitacaoRepository;
import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.entity.Usuario;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdministradorService {

    private final UsuarioRepository usuarioRepository;
    private final DoacaoRepository doacaoRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findByPerfilAndAtivoTrueOrderByNome(Perfil.ADMINISTRADOR).stream()
                .map(UsuarioResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscar(Integer id) {
        return UsuarioResponse.of(porId(id));
    }

    public UsuarioResponse criar(AdministradorRequest req) {
        if (req.senha() == null || req.senha().length() < 6) {
            throw new ValidacaoException("senha", "Senha deve ter no mínimo 6 caracteres.");
        }
        String email = req.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflitoException("E-mail já cadastrado.");
        }
        Usuario admin = Usuario.builder()
                .nome(req.nome().trim())
                .email(email)
                .senhaHash(passwordEncoder.encode(req.senha()))
                .telefone(req.telefone())
                .perfil(Perfil.ADMINISTRADOR)
                .ativo(true)
                .build();
        return UsuarioResponse.of(usuarioRepository.saveAndFlush(admin));
    }

    public UsuarioResponse atualizar(Integer id, AdministradorRequest req) {
        Usuario admin = porId(id);
        String email = req.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmailAndIdNot(email, id)) {
            throw new ConflitoException("E-mail já cadastrado.");
        }
        if (req.senha() != null && !req.senha().isBlank()) {
            if (req.senha().length() < 6) {
                throw new ValidacaoException("senha", "Senha deve ter no mínimo 6 caracteres.");
            }
            admin.setSenhaHash(passwordEncoder.encode(req.senha()));
        }
        admin.setNome(req.nome().trim());
        admin.setEmail(email);
        admin.setTelefone(req.telefone());
        return UsuarioResponse.of(usuarioRepository.saveAndFlush(admin));
    }

    /** RN08 + proteção: não exclui a si mesmo nem o último administrador ativo. */
    public ExclusaoResponse excluir(Integer logadoId, Integer id) {
        Usuario admin = porId(id);
        if (admin.getId().equals(logadoId)) {
            throw new NegocioException("Você não pode excluir o próprio usuário.");
        }
        if (admin.isAtivo() && usuarioRepository.countByPerfilAndAtivoTrue(Perfil.ADMINISTRADOR) <= 1) {
            throw new NegocioException("Não é possível excluir o último administrador.");
        }
        boolean temHistorico = doacaoRepository.existsByRecebidaPorId(id)
                || solicitacaoRepository.existsByAvaliadaPorId(id);
        if (temHistorico) {
            admin.setAtivo(false);
            usuarioRepository.save(admin);
            return ExclusaoResponse.desativado();
        }
        usuarioRepository.delete(admin);
        return ExclusaoResponse.excluido();
    }

    private Usuario porId(Integer id) {
        return usuarioRepository.findByIdAndPerfil(id, Perfil.ADMINISTRADOR).orElseThrow(NaoEncontradoException::new);
    }
}
