package reiz.food_donation_management.solicitacao.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record SolicitacaoRequest(
        @NotEmpty(message = "Informe ao menos um item.") List<@Valid Item> itens) {

    public record Item(
            @NotNull(message = "Alimento é obrigatório.") Integer alimentoId,
            @NotNull(message = "Quantidade é obrigatória.") @DecimalMin(value = "0", inclusive = false, message = "Quantidade deve ser maior que zero.")
            @Digits(integer = 8, fraction = 2, message = "Quantidade inválida.") BigDecimal quantidade) {
    }
}
