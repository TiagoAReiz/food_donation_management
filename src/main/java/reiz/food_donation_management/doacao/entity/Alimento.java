package reiz.food_donation_management.doacao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "alimento")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "doacao_id", nullable = false)
    private Doacao doacao;

    @Column(nullable = false, length = 100)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    private Categoria categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Unidade unidade;

    @Column(nullable = false)
    private LocalDate validade;

    @Builder.Default
    @Column(name = "qtd_disponivel", nullable = false, precision = 10, scale = 2)
    private BigDecimal qtdDisponivel = BigDecimal.ZERO;
}
