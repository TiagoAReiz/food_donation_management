package reiz.food_donation_management.administrador.dto;

import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.entity.Usuario;

import java.time.LocalDateTime;

public record UsuarioResponse(Integer id, String nome, String email, String telefone, Perfil perfil,
                              boolean ativo, LocalDateTime criadoEm) {

    public static UsuarioResponse of(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getTelefone(), u.getPerfil(),
                u.isAtivo(), u.getCriadoEm());
    }
}
