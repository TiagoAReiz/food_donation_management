package reiz.food_donation_management.solicitacao.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.dto.MotivoRequest;
import reiz.food_donation_management.solicitacao.dto.SolicitacaoRequest;
import reiz.food_donation_management.solicitacao.dto.SolicitacaoResponse;
import reiz.food_donation_management.solicitacao.entity.SituacaoSolicitacao;
import reiz.food_donation_management.solicitacao.service.SolicitacaoService;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService service;

    @GetMapping("/minhas")
    @PreAuthorize("hasRole('ENTIDADE')")
    public List<SolicitacaoResponse> minhas(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.minhas(usuario.id());
    }

    @PostMapping
    @PreAuthorize("hasRole('ENTIDADE')")
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitacaoResponse criar(@AuthenticationPrincipal UsuarioLogado usuario,
                                     @Valid @RequestBody SolicitacaoRequest req) {
        return service.criar(usuario.id(), req);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ENTIDADE','ADMINISTRADOR')")
    public SolicitacaoResponse buscar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id) {
        return service.buscar(usuario, id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENTIDADE')")
    public SolicitacaoResponse atualizar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id,
                                         @Valid @RequestBody SolicitacaoRequest req) {
        return service.atualizar(usuario.id(), id, req);
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ENTIDADE')")
    public SolicitacaoResponse cancelar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id) {
        return service.cancelar(usuario.id(), id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<SolicitacaoResponse> listar(@RequestParam(required = false) SituacaoSolicitacao situacao) {
        return service.listar(situacao);
    }

    @PostMapping("/{id}/aprovar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public SolicitacaoResponse aprovar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id) {
        return service.aprovar(usuario.id(), id);
    }

    @PostMapping("/{id}/recusar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public SolicitacaoResponse recusar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id,
                                       @Valid @RequestBody MotivoRequest req) {
        return service.recusar(usuario.id(), id, req.motivo());
    }

    @PostMapping("/{id}/entregar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public SolicitacaoResponse entregar(@PathVariable Integer id) {
        return service.entregar(id);
    }
}
