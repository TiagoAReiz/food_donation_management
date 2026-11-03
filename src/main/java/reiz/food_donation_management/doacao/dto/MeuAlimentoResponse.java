package reiz.food_donation_management.doacao.dto;

import reiz.food_donation_management.doacao.entity.Alimento;
import reiz.food_donation_management.doacao.entity.Categoria;
import reiz.food_donation_management.doacao.entity.SituacaoDoacao;
import reiz.food_donation_management.doacao.entity.Unidade;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MeuAlimentoResponse(Integer id, Integer doacaoId, String nome, Categoria categoria,
                                  BigDecimal quantidade, BigDecimal qtdDisponivel, Unidade unidade,
                                  LocalDate validade, SituacaoDoacao situacaoDoacao, LocalDate dataDoacao) {

    public static MeuAlimentoResponse of(Alimento a) {
        var d = a.getDoacao();
        return new MeuAlimentoResponse(a.getId(), d.getId(), a.getNome(), a.getCategoria(), a.getQuantidade(),
                a.getQtdDisponivel(), a.getUnidade(), a.getValidade(), d.getSituacao(), d.getDataDoacao());
    }
}
