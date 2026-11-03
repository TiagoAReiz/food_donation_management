package reiz.food_donation_management.estoque.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AjusteEstoqueRequest(
        @NotNull(message = "Quantidade disponível é obrigatória.")
        @DecimalMin(value = "0", message = "Quantidade não pode ser negativa.")
        @Digits(integer = 8, fraction = 2, message = "Quantidade inválida.") BigDecimal qtdDisponivel) {
}
