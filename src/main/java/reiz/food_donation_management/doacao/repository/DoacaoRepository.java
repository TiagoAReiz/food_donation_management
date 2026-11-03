package reiz.food_donation_management.doacao.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reiz.food_donation_management.doacao.entity.Doacao;
import reiz.food_donation_management.doacao.entity.SituacaoDoacao;

import java.util.List;
import java.util.Optional;

public interface DoacaoRepository extends JpaRepository<Doacao, Integer> {

    List<Doacao> findByDoadorUsuarioIdOrderByIdDesc(Integer usuarioId);

    Optional<Doacao> findByIdAndDoadorUsuarioId(Integer id, Integer usuarioId);

    List<Doacao> findAllByOrderByIdDesc();

    List<Doacao> findBySituacaoOrderByIdAsc(SituacaoDoacao situacao);

    List<Doacao> findBySituacaoOrderByIdDesc(SituacaoDoacao situacao);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from Doacao d where d.id = :id")
    Optional<Doacao> findByIdForUpdate(@Param("id") Integer id);

    boolean existsByDoadorId(Integer doadorId);

    boolean existsByRecebidaPorId(Integer usuarioId);

    long countBySituacao(SituacaoDoacao situacao);

    long countByDoadorUsuarioId(Integer usuarioId);

    long countByDoadorUsuarioIdAndSituacao(Integer usuarioId, SituacaoDoacao situacao);
}
