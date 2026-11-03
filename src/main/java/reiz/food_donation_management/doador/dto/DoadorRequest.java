package reiz.food_donation_management.doador.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import reiz.food_donation_management.doador.entity.TipoPessoa;

public record DoadorRequest(
        @NotBlank(message = "Nome é obrigatório.") @Size(max = 120, message = "Nome deve ter no máximo 120 caracteres.") String nome,
        @NotBlank(message = "E-mail é obrigatório.") @Email(message = "E-mail inválido.") @Size(max = 120, message = "E-mail deve ter no máximo 120 caracteres.") String email,
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.") String telefone,
        @NotNull(message = "Tipo de pessoa é obrigatório.") TipoPessoa tipoPessoa,
        @NotBlank(message = "Documento é obrigatório.") String documento,
        @Size(max = 200, message = "Endereço deve ter no máximo 200 caracteres.") String endereco,
        String senha) {
}
