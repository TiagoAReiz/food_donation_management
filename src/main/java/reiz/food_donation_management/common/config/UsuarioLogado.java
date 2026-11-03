package reiz.food_donation_management.common.config;

import reiz.food_donation_management.usuario.entity.Perfil;

/** Principal da autenticação JWT. */
public record UsuarioLogado(Integer id, String email, Perfil perfil) {
}
