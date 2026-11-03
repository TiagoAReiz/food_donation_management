package reiz.food_donation_management.doacao.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ConfirmarDoacaoRequest(List<@Valid Correcao> alimentos) {

    public record Correcao(
            @NotNull(message = "Id do alimento é obrigatório.") Integer id,
            @NotNull(message = "Quantidade é obrigatória.") @DecimalMin(value = "0", inclusive = false, message = "Quantidade deve ser maior que zero.")
            @Digits(integer = 8, fraction = 2, message = "Quantidade inválida.") BigDecimal quantidade) {
    }
}
