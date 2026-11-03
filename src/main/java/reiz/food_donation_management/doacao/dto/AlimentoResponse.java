package reiz.food_donation_management.doacao.dto;

import reiz.food_donation_management.doacao.entity.Alimento;
import reiz.food_donation_management.doacao.entity.Categoria;
import reiz.food_donation_management.doacao.entity.Unidade;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AlimentoResponse(Integer id, String nome, Categoria categoria, BigDecimal quantidade,
                               Unidade unidade, LocalDate validade, BigDecimal qtdDisponivel) {

    public static AlimentoResponse of(Alimento a) {
        return new AlimentoResponse(a.getId(), a.getNome(), a.getCategoria(), a.getQuantidade(),
                a.getUnidade(), a.getValidade(), a.getQtdDisponivel());
    }
}
