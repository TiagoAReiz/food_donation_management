package reiz.food_donation_management.usuario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Integer id);

    long countByPerfilAndAtivoTrue(Perfil perfil);

    List<Usuario> findByPerfilAndAtivoTrueOrderByNome(Perfil perfil);

    Optional<Usuario> findByIdAndPerfil(Integer id, Perfil perfil);
}
