package reiz.food_donation_management.entidade.dto;

import jakarta.validation.constraints.*;

public record EntidadeRequest(
        @NotBlank(message = "Nome é obrigatório.") @Size(max = 120, message = "Nome deve ter no máximo 120 caracteres.") String nome,
        @NotBlank(message = "E-mail é obrigatório.") @Email(message = "E-mail inválido.") @Size(max = 120, message = "E-mail deve ter no máximo 120 caracteres.") String email,
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.") String telefone,
        @NotBlank(message = "CNPJ é obrigatório.") String cnpj,
        @NotBlank(message = "Endereço é obrigatório.") @Size(max = 200, message = "Endereço deve ter no máximo 200 caracteres.") String endereco,
        @NotBlank(message = "Responsável é obrigatório.") @Size(max = 120, message = "Responsável deve ter no máximo 120 caracteres.") String responsavel,
        @NotNull(message = "Número de pessoas atendidas é obrigatório.") @Positive(message = "Pessoas atendidas deve ser maior que zero.") Integer pessoasAtendidas,
        String senha) {
}
