package reiz.food_donation_management.doacao.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reiz.food_donation_management.doacao.entity.Alimento;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AlimentoRepository extends JpaRepository<Alimento, Integer> {

    String RECEBIDA = "d.situacao = reiz.food_donation_management.doacao.entity.SituacaoDoacao.RECEBIDA";

    /** Estoque disponível em ordem FEFO (RN07). */
    @Query("select a from Alimento a join fetch a.doacao d where " + RECEBIDA
            + " and a.qtdDisponivel > 0 and a.validade >= :hoje order by a.validade asc, a.id asc")
    List<Alimento> findEstoque(@Param("hoje") LocalDate hoje);

    @Query("select a from Alimento a join fetch a.doacao d where " + RECEBIDA
            + " and a.qtdDisponivel > 0 and a.validade < :hoje order by a.validade asc, a.id asc")
    List<Alimento> findVencidos(@Param("hoje") LocalDate hoje);

    @Query("select a from Alimento a join fetch a.doacao d where " + RECEBIDA
            + " and a.id = :id and a.qtdDisponivel > 0 and a.validade >= :hoje")
    Optional<Alimento> findDisponivelById(@Param("id") Integer id, @Param("hoje") LocalDate hoje);

    @Query("select a from Alimento a join fetch a.doacao d where d.doador.usuario.id = :usuarioId "
            + "order by d.dataDoacao desc, d.id desc, a.id asc")
    List<Alimento> findDoDoador(@Param("usuarioId") Integer usuarioId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Alimento a where a.id in :ids order by a.id")
    List<Alimento> findAllByIdForUpdate(@Param("ids") Collection<Integer> ids);

    @Query("select count(a) from Alimento a join a.doacao d where " + RECEBIDA
            + " and a.qtdDisponivel > 0 and a.validade >= :hoje")
    long countEstoque(@Param("hoje") LocalDate hoje);

    @Query("select count(a) from Alimento a join a.doacao d where " + RECEBIDA
            + " and a.qtdDisponivel > 0 and a.validade < :hoje")
    long countVencidos(@Param("hoje") LocalDate hoje);

    @Query("select count(a) from Alimento a join a.doacao d where " + RECEBIDA
            + " and a.qtdDisponivel > 0 and a.validade >= :hoje and a.validade <= :limite")
    long countVencendo(@Param("hoje") LocalDate hoje, @Param("limite") LocalDate limite);

    @Query("select count(a) from Alimento a join a.doacao d where " + RECEBIDA
            + " and d.doador.usuario.id = :usuarioId and a.qtdDisponivel > 0 and a.validade >= :hoje")
    long countEstoqueDoDoador(@Param("usuarioId") Integer usuarioId, @Param("hoje") LocalDate hoje);
}
