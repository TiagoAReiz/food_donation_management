package reiz.food_donation_management.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.auth.dto.*;
import reiz.food_donation_management.common.config.JwtService;
import reiz.food_donation_management.common.exception.ConflitoException;
import reiz.food_donation_management.common.exception.NaoAutenticadoException;
import reiz.food_donation_management.doador.dto.DoadorResponse;
import reiz.food_donation_management.doador.entity.Doador;
import reiz.food_donation_management.doador.repository.DoadorRepository;
import reiz.food_donation_management.doador.service.DoadorService;
import reiz.food_donation_management.entidade.dto.EntidadeResponse;
import reiz.food_donation_management.entidade.entity.Entidade;
import reiz.food_donation_management.entidade.repository.EntidadeRepository;
import reiz.food_donation_management.entidade.service.EntidadeService;
import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.entity.Usuario;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private static final String MSG_LOGIN = "E-mail ou senha inválidos.";

    private final UsuarioRepository usuarioRepository;
    private final DoadorRepository doadorRepository;
    private final EntidadeRepository entidadeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(req.email().trim().toLowerCase())
                .filter(Usuario::isAtivo)
                .filter(u -> passwordEncoder.matches(req.senha(), u.getSenhaHash()))
                .orElseThrow(() -> new NaoAutenticadoException(MSG_LOGIN));
        return new LoginResponse(jwtService.gerar(usuario), montarMe(usuario));
    }

    @Transactional(readOnly = true)
    public MeResponse me(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NaoAutenticadoException("Autenticação necessária."));
        return montarMe(usuario);
    }

    public DoadorResponse cadastrarDoador(CadastroDoadorRequest req) {
        String documento = DoadorService.normalizarDocumento(req.tipoPessoa(), req.documento());
        String email = req.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflitoException("E-mail já cadastrado.");
        }
        if (doadorRepository.existsByDocumento(documento)) {
            throw new ConflitoException("CPF/CNPJ já cadastrado.");
        }
        Doador doador = Doador.builder()
                .usuario(novoUsuario(req.nome(), email, req.senha(), req.telefone(), Perfil.DOADOR))
                .tipoPessoa(req.tipoPessoa())
                .documento(documento)
                .endereco(req.endereco())
                .build();
        return DoadorResponse.of(doadorRepository.saveAndFlush(doador));
    }

    public EntidadeResponse cadastrarEntidade(CadastroEntidadeRequest req) {
        String cnpj = EntidadeService.normalizarCnpj(req.cnpj());
        String email = req.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflitoException("E-mail já cadastrado.");
        }
        if (entidadeRepository.existsByCnpj(cnpj)) {
            throw new ConflitoException("CNPJ já cadastrado.");
        }
        Entidade entidade = Entidade.builder()
                .usuario(novoUsuario(req.nome(), email, req.senha(), req.telefone(), Perfil.ENTIDADE))
                .cnpj(cnpj)
                .endereco(req.endereco())
                .responsavel(req.responsavel())
                .pessoasAtendidas(req.pessoasAtendidas())
                .aprovada(false)
                .build();
        return EntidadeResponse.of(entidadeRepository.saveAndFlush(entidade));
    }

    private Usuario novoUsuario(String nome, String email, String senha, String telefone, Perfil perfil) {
        return Usuario.builder()
                .nome(nome.trim())
                .email(email)
                .senhaHash(passwordEncoder.encode(senha))
                .telefone(telefone)
                .perfil(perfil)
                .ativo(true)
                .build();
    }

    private MeResponse montarMe(Usuario u) {
        Integer doadorId = null;
        Integer entidadeId = null;
        Boolean aprovada = null;
        if (u.getPerfil() == Perfil.DOADOR) {
            doadorId = doadorRepository.findByUsuarioId(u.getId()).map(Doador::getId).orElse(null);
        } else if (u.getPerfil() == Perfil.ENTIDADE) {
            var entidade = entidadeRepository.findByUsuarioId(u.getId()).orElse(null);
            if (entidade != null) {
                entidadeId = entidade.getId();
                aprovada = entidade.isAprovada();
            }
        }
        return new MeResponse(u.getId(), u.getNome(), u.getEmail(), u.getTelefone(), u.getPerfil(),
                doadorId, entidadeId, aprovada);
    }
}
