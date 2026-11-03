package reiz.food_donation_management.doacao.entity;

import jakarta.persistence.*;
import lombok.*;
import reiz.food_donation_management.doador.entity.Doador;
import reiz.food_donation_management.usuario.entity.Usuario;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doacao")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "doador_id", nullable = false)
    private Doador doador;

    @Column(name = "data_doacao", nullable = false)
    private LocalDate dataDoacao;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private SituacaoDoacao situacao = SituacaoDoacao.PENDENTE;

    @Column(name = "recebida_em")
    private LocalDateTime recebidaEm;

    @ManyToOne
    @JoinColumn(name = "recebida_por")
    private Usuario recebidaPor;

    @Column(length = 255)
    private String observacao;

    @Builder.Default
    @OneToMany(mappedBy = "doacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<Alimento> alimentos = new ArrayList<>();

    public void adicionarAlimento(Alimento alimento) {
        alimento.setDoacao(this);
        alimentos.add(alimento);
    }
}
