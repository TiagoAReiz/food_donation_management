package reiz.food_donation_management.doador.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.dto.ExclusaoResponse;
import reiz.food_donation_management.common.exception.ConflitoException;
import reiz.food_donation_management.common.exception.NaoEncontradoException;
import reiz.food_donation_management.common.exception.ValidacaoException;
import reiz.food_donation_management.common.util.DocumentoUtil;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.doador.dto.DoadorRequest;
import reiz.food_donation_management.doador.dto.DoadorResponse;
import reiz.food_donation_management.doador.entity.Doador;
import reiz.food_donation_management.doador.entity.TipoPessoa;
import reiz.food_donation_management.doador.repository.DoadorRepository;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DoadorService {

    private final DoadorRepository doadorRepository;
    private final UsuarioRepository usuarioRepository;
    private final DoacaoRepository doacaoRepository;
    private final PasswordEncoder passwordEncoder;

    /** Valida os dígitos verificadores conforme o tipo de pessoa e devolve o documento formatado. */
    public static String normalizarDocumento(TipoPessoa tipo, String documento) {
        if (tipo == TipoPessoa.FISICA) {
            if (!DocumentoUtil.cpfValido(documento)) {
                throw new ValidacaoException("documento", "CPF inválido.");
            }
            return DocumentoUtil.formatarCpf(documento);
        }
        if (!DocumentoUtil.cnpjValido(documento)) {
            throw new ValidacaoException("documento", "CNPJ inválido.");
        }
        return DocumentoUtil.formatarCnpj(documento);
    }

    @Transactional(readOnly = true)
    public DoadorResponse buscarPorUsuario(Integer usuarioId) {
        return DoadorResponse.of(porUsuario(usuarioId));
    }

    public DoadorResponse atualizarPorUsuario(Integer usuarioId, DoadorRequest req) {
        return DoadorResponse.of(atualizar(porUsuario(usuarioId), req));
    }

    public ExclusaoResponse excluirPorUsuario(Integer usuarioId) {
        return excluir(porUsuario(usuarioId));
    }

    @Transactional(readOnly = true)
    public List<DoadorResponse> listar() {
        return doadorRepository.findByUsuarioAtivoTrueOrderByUsuarioNome().stream().map(DoadorResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public DoadorResponse buscar(Integer id) {
        return DoadorResponse.of(porId(id));
    }

    public DoadorResponse atualizar(Integer id, DoadorRequest req) {
        return DoadorResponse.of(atualizar(porId(id), req));
    }

    public ExclusaoResponse excluir(Integer id) {
        return excluir(porId(id));
    }

    private Doador atualizar(Doador doador, DoadorRequest req) {
        var usuario = doador.getUsuario();
        String email = req.email().trim().toLowerCase();
        String documento = normalizarDocumento(req.tipoPessoa(), req.documento());
        if (usuarioRepository.existsByEmailAndIdNot(email, usuario.getId())) {
            throw new ConflitoException("E-mail já cadastrado.");
        }
        if (doadorRepository.existsByDocumentoAndIdNot(documento, doador.getId())) {
            throw new ConflitoException("CPF/CNPJ já cadastrado.");
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
        doador.setTipoPessoa(req.tipoPessoa());
        doador.setDocumento(documento);
        doador.setEndereco(req.endereco());
        return doadorRepository.saveAndFlush(doador);
    }

    /** RN08: com doações apenas desativa; sem histórico apaga usuário e doador. */
    private ExclusaoResponse excluir(Doador doador) {
        if (doacaoRepository.existsByDoadorId(doador.getId())) {
            doador.getUsuario().setAtivo(false);
            doadorRepository.save(doador);
            return ExclusaoResponse.desativado();
        }
        doadorRepository.delete(doador);
        return ExclusaoResponse.excluido();
    }

    private Doador porUsuario(Integer usuarioId) {
        return doadorRepository.findByUsuarioId(usuarioId).orElseThrow(NaoEncontradoException::new);
    }

    private Doador porId(Integer id) {
        return doadorRepository.findById(id).orElseThrow(NaoEncontradoException::new);
    }
}
