package reiz.food_donation_management.solicitacao.entity;

import jakarta.persistence.*;
import lombok.*;
import reiz.food_donation_management.entidade.entity.Entidade;
import reiz.food_donation_management.usuario.entity.Usuario;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacao")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "entidade_id", nullable = false)
    private Entidade entidade;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDate dataSolicitacao;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private SituacaoSolicitacao situacao = SituacaoSolicitacao.PENDENTE;

    @ManyToOne
    @JoinColumn(name = "avaliada_por")
    private Usuario avaliadaPor;

    @Column(name = "data_entrega")
    private LocalDate dataEntrega;

    @Column(name = "motivo_recusa", length = 255)
    private String motivoRecusa;

    @Builder.Default
    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<ItemSolicitacao> itens = new ArrayList<>();

    public void adicionarItem(ItemSolicitacao item) {
        item.setSolicitacao(this);
        itens.add(item);
    }
}
