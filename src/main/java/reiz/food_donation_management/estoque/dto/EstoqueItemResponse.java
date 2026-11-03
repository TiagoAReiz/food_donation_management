package reiz.food_donation_management.estoque.dto;

import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.doacao.entity.Alimento;
import reiz.food_donation_management.doacao.entity.Categoria;
import reiz.food_donation_management.doacao.entity.Unidade;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * qtdDisponivel = livre para novos pedidos; qtdReservada = separada para pedidos aprovados;
 * qtdEmEstoque = quantidade física (livre + reservada).
 */
public record EstoqueItemResponse(Integer id, String nome, Categoria categoria, BigDecimal qtdDisponivel,
                                  BigDecimal qtdReservada, BigDecimal qtdEmEstoque, Unidade unidade,
                                  LocalDate validade, Integer doacaoId, long diasParaVencer) {

    public static EstoqueItemResponse of(Alimento a) {
        return new EstoqueItemResponse(a.getId(), a.getNome(), a.getCategoria(), a.getQtdLivre(),
                a.getQtdReservada(), a.getQtdDisponivel(), a.getUnidade(), a.getValidade(), a.getDoacao().getId(),
                ChronoUnit.DAYS.between(DataUtil.hoje(), a.getValidade()));
    }
}
