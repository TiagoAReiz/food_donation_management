package reiz.food_donation_management.doacao.dto;

import jakarta.validation.constraints.*;
import reiz.food_donation_management.doacao.entity.Categoria;
import reiz.food_donation_management.doacao.entity.Unidade;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AlimentoRequest(
        @NotBlank(message = "Nome do alimento é obrigatório.") @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres.") String nome,
        @NotNull(message = "Categoria é obrigatória.") Categoria categoria,
        @NotNull(message = "Quantidade é obrigatória.") @DecimalMin(value = "0", inclusive = false, message = "Quantidade deve ser maior que zero.")
        @Digits(integer = 8, fraction = 2, message = "Quantidade inválida.") BigDecimal quantidade,
        @NotNull(message = "Unidade é obrigatória.") Unidade unidade,
        @NotNull(message = "Validade é obrigatória.") LocalDate validade) {
}
