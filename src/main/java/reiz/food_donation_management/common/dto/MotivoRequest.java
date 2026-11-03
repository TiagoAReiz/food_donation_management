package reiz.food_donation_management.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MotivoRequest(
        @NotBlank(message = "Informe o motivo da recusa.")
        @Size(max = 255, message = "Motivo deve ter no máximo 255 caracteres.") String motivo) {
}
