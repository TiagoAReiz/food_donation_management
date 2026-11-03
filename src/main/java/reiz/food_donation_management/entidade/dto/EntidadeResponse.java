package reiz.food_donation_management.entidade.dto;

import reiz.food_donation_management.entidade.entity.Entidade;

import java.time.LocalDateTime;

public record EntidadeResponse(Integer id, Integer usuarioId, String nome, String email, String telefone,
                               String cnpj, String endereco, String responsavel, Integer pessoasAtendidas,
                               boolean aprovada, boolean ativo, LocalDateTime criadoEm) {

    public static EntidadeResponse of(Entidade e) {
        var u = e.getUsuario();
        return new EntidadeResponse(e.getId(), u.getId(), u.getNome(), u.getEmail(), u.getTelefone(),
                e.getCnpj(), e.getEndereco(), e.getResponsavel(), e.getPessoasAtendidas(),
                e.isAprovada(), u.isAtivo(), u.getCriadoEm());
    }
}
