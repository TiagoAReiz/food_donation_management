package reiz.food_donation_management.doador.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reiz.food_donation_management.doador.entity.Doador;

import java.util.List;
import java.util.Optional;

public interface DoadorRepository extends JpaRepository<Doador, Integer> {

    Optional<Doador> findByUsuarioId(Integer usuarioId);

    List<Doador> findByUsuarioAtivoTrueOrderByUsuarioNome();

    boolean existsByDocumento(String documento);

    boolean existsByDocumentoAndIdNot(String documento, Integer id);
}
