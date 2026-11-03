package reiz.food_donation_management.doador.dto;

import reiz.food_donation_management.doador.entity.Doador;
import reiz.food_donation_management.doador.entity.TipoPessoa;

import java.time.LocalDateTime;

public record DoadorResponse(Integer id, Integer usuarioId, String nome, String email, String telefone,
                             TipoPessoa tipoPessoa, String documento, String endereco, boolean ativo,
                             LocalDateTime criadoEm) {

    public static DoadorResponse of(Doador d) {
        var u = d.getUsuario();
        return new DoadorResponse(d.getId(), u.getId(), u.getNome(), u.getEmail(), u.getTelefone(),
                d.getTipoPessoa(), d.getDocumento(), d.getEndereco(), u.isAtivo(), u.getCriadoEm());
    }
}
