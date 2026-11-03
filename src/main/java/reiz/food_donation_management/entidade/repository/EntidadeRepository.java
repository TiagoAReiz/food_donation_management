package reiz.food_donation_management.entidade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reiz.food_donation_management.entidade.entity.Entidade;

import java.util.List;
import java.util.Optional;

public interface EntidadeRepository extends JpaRepository<Entidade, Integer> {

    Optional<Entidade> findByUsuarioId(Integer usuarioId);

    List<Entidade> findByUsuarioAtivoTrueOrderByUsuarioNome();

    List<Entidade> findByAprovadaAndUsuarioAtivoTrueOrderByUsuarioNome(boolean aprovada);

    boolean existsByCnpj(String cnpj);

    boolean existsByCnpjAndIdNot(String cnpj, Integer id);

    long countByAprovadaFalseAndUsuarioAtivoTrue();
}
