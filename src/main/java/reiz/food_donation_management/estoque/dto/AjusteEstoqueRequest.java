package reiz.food_donation_management.estoque.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Quantidade física que existe no estoque (inclui o que está reservado). */
public record AjusteEstoqueRequest(
        @NotNull(message = "Quantidade em estoque é obrigatória.")
        @DecimalMin(value = "0", message = "Quantidade não pode ser negativa.")
        @Digits(integer = 8, fraction = 2, message = "Quantidade inválida.") BigDecimal qtdEmEstoque) {
}
