package reiz.food_donation_management.doador.entity;

import jakarta.persistence.*;
import lombok.*;
import reiz.food_donation_management.usuario.entity.Usuario;

@Entity
@Table(name = "doador")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pessoa", nullable = false, length = 10)
    private TipoPessoa tipoPessoa;

    @Column(nullable = false, length = 18)
    private String documento;

    @Column(length = 200)
    private String endereco;
}
