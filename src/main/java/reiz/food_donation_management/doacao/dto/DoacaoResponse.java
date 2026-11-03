package reiz.food_donation_management.doacao.dto;

import reiz.food_donation_management.common.dto.UsuarioResumo;
import reiz.food_donation_management.doacao.entity.Doacao;
import reiz.food_donation_management.doacao.entity.SituacaoDoacao;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record DoacaoResponse(Integer id, UsuarioResumo doador, LocalDate dataDoacao, SituacaoDoacao situacao,
                             LocalDateTime recebidaEm, UsuarioResumo recebidaPor, String observacao,
                             List<AlimentoResponse> alimentos) {

    public static DoacaoResponse of(Doacao d) {
        var admin = d.getRecebidaPor();
        return new DoacaoResponse(d.getId(),
                new UsuarioResumo(d.getDoador().getId(), d.getDoador().getUsuario().getNome()),
                d.getDataDoacao(), d.getSituacao(), d.getRecebidaEm(),
                admin == null ? null : new UsuarioResumo(admin.getId(), admin.getNome()),
                d.getObservacao(),
                d.getAlimentos().stream().map(AlimentoResponse::of).toList());
    }
}
