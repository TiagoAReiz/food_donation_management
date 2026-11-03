package reiz.food_donation_management.auth.dto;

import reiz.food_donation_management.usuario.entity.Perfil;

public record MeResponse(Integer id, String nome, String email, String telefone, Perfil perfil,
                         Integer doadorId, Integer entidadeId, Boolean entidadeAprovada) {
}
