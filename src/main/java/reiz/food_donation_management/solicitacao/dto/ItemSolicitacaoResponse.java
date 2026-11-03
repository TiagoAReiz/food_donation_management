package reiz.food_donation_management.solicitacao.dto;

import reiz.food_donation_management.doacao.entity.Categoria;
import reiz.food_donation_management.doacao.entity.Unidade;
import reiz.food_donation_management.solicitacao.entity.ItemSolicitacao;

import java.math.BigDecimal;
import java.time.LocalDate;

/** qtdDisponivel = quantidade livre do lote agora (sem contar reservas de pedidos aprovados). */
public record ItemSolicitacaoResponse(Integer id, Integer alimentoId, String nome, Categoria categoria,
                                      Unidade unidade, LocalDate validade, BigDecimal quantidade,
                                      BigDecimal qtdDisponivel) {

    public static ItemSolicitacaoResponse of(ItemSolicitacao i) {
        var a = i.getAlimento();
        return new ItemSolicitacaoResponse(i.getId(), a.getId(), a.getNome(), a.getCategoria(), a.getUnidade(),
                a.getValidade(), i.getQuantidade(), a.getQtdLivre());
    }
}
