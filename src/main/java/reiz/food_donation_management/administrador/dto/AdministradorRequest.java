package reiz.food_donation_management.administrador.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Na criação a senha é obrigatória; na edição, vazia significa "não alterar". */
public record AdministradorRequest(
        @NotBlank(message = "Nome é obrigatório.") @Size(max = 120, message = "Nome deve ter no máximo 120 caracteres.") String nome,
        @NotBlank(message = "E-mail é obrigatório.") @Email(message = "E-mail inválido.") @Size(max = 120, message = "E-mail deve ter no máximo 120 caracteres.") String email,
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.") String telefone,
        String senha) {
}
