package reiz.food_donation_management.entidade.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.dto.ExclusaoResponse;
import reiz.food_donation_management.common.exception.ConflitoException;
import reiz.food_donation_management.common.exception.NaoEncontradoException;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.exception.ValidacaoException;
import reiz.food_donation_management.common.util.DocumentoUtil;
import reiz.food_donation_management.entidade.dto.EntidadeRequest;
import reiz.food_donation_management.entidade.dto.EntidadeResponse;
import reiz.food_donation_management.entidade.entity.Entidade;
import reiz.food_donation_management.entidade.repository.EntidadeRepository;
import reiz.food_donation_management.solicitacao.repository.SolicitacaoRepository;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EntidadeService {

    private final EntidadeRepository entidadeRepository;
    private final UsuarioRepository usuarioRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final PasswordEncoder passwordEncoder;

    public static String normalizarCnpj(String cnpj) {
        if (!DocumentoUtil.cnpjValido(cnpj)) {
            throw new ValidacaoException("cnpj", "CNPJ inválido.");
        }
        return DocumentoUtil.formatarCnpj(cnpj);
    }

    @Transactional(readOnly = true)
    public EntidadeResponse buscarPorUsuario(Integer usuarioId) {
        return EntidadeResponse.of(porUsuario(usuarioId));
    }

    public EntidadeResponse atualizarPorUsuario(Integer usuarioId, EntidadeRequest req) {
        return EntidadeResponse.of(atualizar(porUsuario(usuarioId), req));
    }

    public ExclusaoResponse excluirPorUsuario(Integer usuarioId) {
        return excluir(porUsuario(usuarioId));
    }

    @Transactional(readOnly = true)
    public List<EntidadeResponse> listar(Boolean aprovada) {
        var lista = aprovada == null
                ? entidadeRepository.findByUsuarioAtivoTrueOrderByUsuarioNome()
                : entidadeRepository.findByAprovadaAndUsuarioAtivoTrueOrderByUsuarioNome(aprovada);
        return lista.stream().map(EntidadeResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public EntidadeResponse buscar(Integer id) {
        return EntidadeResponse.of(porId(id));
    }

    public EntidadeResponse atualizar(Integer id, EntidadeRequest req) {
        return EntidadeResponse.of(atualizar(porId(id), req));
    }

    public ExclusaoResponse excluir(Integer id) {
        return excluir(porId(id));
    }

    public EntidadeResponse aprovar(Integer id) {
        Entidade entidade = porId(id);
        entidade.setAprovada(true);
        return EntidadeResponse.of(entidadeRepository.save(entidade));
    }

    /** UC03-A3: recusar um cadastro pendente exclui o cadastro. */
    public void recusar(Integer id) {
        Entidade entidade = porId(id);
        if (entidade.isAprovada()) {
            throw new NegocioException("Entidade já aprovada não pode ser recusada.");
        }
        entidadeRepository.delete(entidade);
    }

    private Entidade atualizar(Entidade entidade, EntidadeRequest req) {
        var usuario = entidade.getUsuario();
        String email = req.email().trim().toLowerCase();
        String cnpj = normalizarCnpj(req.cnpj());
        if (usuarioRepository.existsByEmailAndIdNot(email, usuario.getId())) {
            throw new ConflitoException("E-mail já cadastrado.");
        }
        if (entidadeRepository.existsByCnpjAndIdNot(cnpj, entidade.getId())) {
            throw new ConflitoException("CNPJ já cadastrado.");
        }
        if (req.senha() != null && !req.senha().isBlank()) {
            if (req.senha().length() < 6) {
                throw new ValidacaoException("senha", "Senha deve ter no mínimo 6 caracteres.");
            }
            usuario.setSenhaHash(passwordEncoder.encode(req.senha()));
        }
        usuario.setNome(req.nome().trim());
        usuario.setEmail(email);
        usuario.setTelefone(req.telefone());
        entidade.setCnpj(cnpj);
        entidade.setEndereco(req.endereco());
        entidade.setResponsavel(req.responsavel());
        entidade.setPessoasAtendidas(req.pessoasAtendidas());
        return entidadeRepository.saveAndFlush(entidade);
    }

    /** RN08: com solicitações apenas desativa; sem histórico apaga. */
    private ExclusaoResponse excluir(Entidade entidade) {
        if (solicitacaoRepository.existsByEntidadeId(entidade.getId())) {
            entidade.getUsuario().setAtivo(false);
            entidadeRepository.save(entidade);
            return ExclusaoResponse.desativado();
        }
        entidadeRepository.delete(entidade);
        return ExclusaoResponse.excluido();
    }

    private Entidade porUsuario(Integer usuarioId) {
        return entidadeRepository.findByUsuarioId(usuarioId).orElseThrow(NaoEncontradoException::new);
    }

    private Entidade porId(Integer id) {
        return entidadeRepository.findById(id).orElseThrow(NaoEncontradoException::new);
    }
}
