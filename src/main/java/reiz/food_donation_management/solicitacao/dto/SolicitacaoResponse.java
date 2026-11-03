package reiz.food_donation_management.solicitacao.dto;

import reiz.food_donation_management.common.dto.UsuarioResumo;
import reiz.food_donation_management.solicitacao.entity.SituacaoSolicitacao;
import reiz.food_donation_management.solicitacao.entity.Solicitacao;

import java.time.LocalDate;
import java.util.List;

public record SolicitacaoResponse(Integer id, UsuarioResumo entidade, LocalDate dataSolicitacao,
                                  SituacaoSolicitacao situacao, UsuarioResumo avaliadaPor, LocalDate dataEntrega,
                                  String motivoRecusa, List<ItemSolicitacaoResponse> itens) {

    public static SolicitacaoResponse of(Solicitacao s) {
        var admin = s.getAvaliadaPor();
        return new SolicitacaoResponse(s.getId(),
                new UsuarioResumo(s.getEntidade().getId(), s.getEntidade().getUsuario().getNome()),
                s.getDataSolicitacao(), s.getSituacao(),
                admin == null ? null : new UsuarioResumo(admin.getId(), admin.getNome()),
                s.getDataEntrega(), s.getMotivoRecusa(),
                s.getItens().stream().map(ItemSolicitacaoResponse::of).toList());
    }
}
