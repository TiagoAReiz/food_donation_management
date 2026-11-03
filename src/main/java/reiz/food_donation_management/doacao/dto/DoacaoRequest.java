package reiz.food_donation_management.doacao.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record DoacaoRequest(
        @Size(max = 255, message = "Observação deve ter no máximo 255 caracteres.") String observacao,
        @NotEmpty(message = "Informe ao menos um alimento.") List<@Valid AlimentoRequest> alimentos) {
}
