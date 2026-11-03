package reiz.food_donation_management.common.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ValidacaoException extends RuntimeException {
    private final Map<String, String> campos;

    public ValidacaoException(Map<String, String> campos) {
        super("Verifique os campos destacados.");
        this.campos = campos;
    }

    public ValidacaoException(String campo, String mensagem) {
        this(Map.of(campo, mensagem));
    }
}
