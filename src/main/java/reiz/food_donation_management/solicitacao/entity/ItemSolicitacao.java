package reiz.food_donation_management.solicitacao.entity;

import jakarta.persistence.*;
import lombok.*;
import reiz.food_donation_management.doacao.entity.Alimento;

import java.math.BigDecimal;

@Entity
@Table(name = "item_solicitacao")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "alimento_id", nullable = false)
    private Alimento alimento;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantidade;
}
