package reiz.food_donation_management.estoque.dto;

import jakarta.validation.constraints.Size;

public record RetiradaRequest(@Size(max = 255, message = "Motivo deve ter no máximo 255 caracteres.") String motivo) {
}
