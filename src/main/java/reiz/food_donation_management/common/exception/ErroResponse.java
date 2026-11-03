package reiz.food_donation_management.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErroResponse(int status, String mensagem, Map<String, String> campos) {

    public static ErroResponse of(int status, String mensagem) {
        return new ErroResponse(status, mensagem, null);
    }
}
