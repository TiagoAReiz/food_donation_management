package reiz.food_donation_management.solicitacao.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reiz.food_donation_management.solicitacao.entity.Solicitacao;
import reiz.food_donation_management.solicitacao.entity.SituacaoSolicitacao;

import java.util.List;
import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {

    List<Solicitacao> findByEntidadeUsuarioIdOrderByIdDesc(Integer usuarioId);

    Optional<Solicitacao> findByIdAndEntidadeUsuarioId(Integer id, Integer usuarioId);

    List<Solicitacao> findAllByOrderByIdDesc();

    List<Solicitacao> findBySituacaoOrderByIdAsc(SituacaoSolicitacao situacao);

    List<Solicitacao> findBySituacaoOrderByIdDesc(SituacaoSolicitacao situacao);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Solicitacao s where s.id = :id")
    Optional<Solicitacao> findByIdForUpdate(@Param("id") Integer id);

    boolean existsByEntidadeId(Integer entidadeId);

    boolean existsByAvaliadaPorId(Integer usuarioId);

    long countBySituacao(SituacaoSolicitacao situacao);

    long countByEntidadeUsuarioIdAndSituacao(Integer usuarioId, SituacaoSolicitacao situacao);
}
