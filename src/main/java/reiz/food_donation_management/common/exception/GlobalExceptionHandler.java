package reiz.food_donation_management.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NegocioException.class)
    public ResponseEntity<ErroResponse> negocio(NegocioException e) {
        return resposta(HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage());
    }

    @ExceptionHandler(NaoEncontradoException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(NaoEncontradoException e) {
        return resposta(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<ErroResponse> conflito(ConflitoException e) {
        return resposta(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(NaoAutenticadoException.class)
    public ResponseEntity<ErroResponse> naoAutenticado(NaoAutenticadoException e) {
        return resposta(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErroResponse> autenticacao(AuthenticationException e) {
        return resposta(HttpStatus.UNAUTHORIZED, "Autenticação necessária.");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResponse> acessoNegado(AccessDeniedException e) {
        return resposta(HttpStatus.FORBIDDEN, "Você não tem permissão para esta ação.");
    }

    @ExceptionHandler(ValidacaoException.class)
    public ResponseEntity<ErroResponse> validacao(ValidacaoException e) {
        return ResponseEntity.badRequest().body(new ErroResponse(400, e.getMessage(), e.getCampos()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> beanValidation(MethodArgumentNotValidException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors()
                .forEach(f -> campos.putIfAbsent(f.getField(), f.getDefaultMessage()));
        return ResponseEntity.badRequest().body(new ErroResponse(400, "Verifique os campos destacados.", campos));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErroResponse> requisicaoInvalida(Exception e) {
        return resposta(HttpStatus.BAD_REQUEST, "Requisição inválida. Verifique os dados enviados.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> integridade(DataIntegrityViolationException e) {
        String detalhe = String.valueOf(e.getMostSpecificCause().getMessage());
        if (detalhe.contains("uk_usuario_email")) {
            return resposta(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }
        if (detalhe.contains("uk_doador_documento")) {
            return resposta(HttpStatus.CONFLICT, "CPF/CNPJ já cadastrado.");
        }
        if (detalhe.contains("uk_entidade_cnpj")) {
            return resposta(HttpStatus.CONFLICT, "CNPJ já cadastrado.");
        }
        log.warn("Violação de integridade: {}", detalhe);
        return resposta(HttpStatus.CONFLICT, "Operação não permitida: o registro possui vínculos ou dados duplicados.");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResponse> metodo(HttpRequestMethodNotSupportedException e) {
        return resposta(HttpStatus.METHOD_NOT_ALLOWED, "Método não permitido.");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroResponse> rota(NoResourceFoundException e) {
        return resposta(HttpStatus.NOT_FOUND, "Recurso não encontrado.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> inesperado(Exception e) {
        log.error("Erro inesperado", e);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor.");
    }

    private ResponseEntity<ErroResponse> resposta(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(ErroResponse.of(status.value(), mensagem));
    }
}
