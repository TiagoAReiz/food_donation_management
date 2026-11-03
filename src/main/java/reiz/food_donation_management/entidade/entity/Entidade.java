package reiz.food_donation_management.entidade.entity;

import jakarta.persistence.*;
import lombok.*;
import reiz.food_donation_management.usuario.entity.Usuario;

@Entity
@Table(name = "entidade")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Entidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, length = 18)
    private String cnpj;

    @Column(nullable = false, length = 200)
    private String endereco;

    @Column(nullable = false, length = 120)
    private String responsavel;

    @Column(name = "pessoas_atendidas", nullable = false)
    private Integer pessoasAtendidas;

    @Builder.Default
    @Column(nullable = false)
    private boolean aprovada = false;
}
