package reiz.food_donation_management.doacao.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.dto.MotivoRequest;
import reiz.food_donation_management.doacao.dto.ConfirmarDoacaoRequest;
import reiz.food_donation_management.doacao.dto.DoacaoRequest;
import reiz.food_donation_management.doacao.dto.DoacaoResponse;
import reiz.food_donation_management.doacao.dto.MeuAlimentoResponse;
import reiz.food_donation_management.doacao.entity.SituacaoDoacao;
import reiz.food_donation_management.doacao.service.DoacaoService;

import java.util.List;

@RestController
@RequestMapping("/api/doacoes")
@RequiredArgsConstructor
public class DoacaoController {

    private final DoacaoService service;

    @GetMapping("/minhas")
    @PreAuthorize("hasRole('DOADOR')")
    public List<DoacaoResponse> minhas(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.minhas(usuario.id());
    }

    @GetMapping("/meus-alimentos")
    @PreAuthorize("hasRole('DOADOR')")
    public List<MeuAlimentoResponse> meusAlimentos(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.meusAlimentos(usuario.id());
    }

    @PostMapping
    @PreAuthorize("hasRole('DOADOR')")
    @ResponseStatus(HttpStatus.CREATED)
    public DoacaoResponse criar(@AuthenticationPrincipal UsuarioLogado usuario,
                                @Valid @RequestBody DoacaoRequest req) {
        return service.criar(usuario.id(), req);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOADOR','ADMINISTRADOR')")
    public DoacaoResponse buscar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id) {
        return service.buscar(usuario, id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOADOR')")
    public DoacaoResponse atualizar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id,
                                    @Valid @RequestBody DoacaoRequest req) {
        return service.atualizar(usuario.id(), id, req);
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('DOADOR')")
    public DoacaoResponse cancelar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id) {
        return service.cancelar(usuario.id(), id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<DoacaoResponse> listar(@RequestParam(required = false) SituacaoDoacao situacao) {
        return service.listar(situacao);
    }

    @PostMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public DoacaoResponse confirmar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id,
                                    @Valid @RequestBody(required = false) ConfirmarDoacaoRequest req) {
        return service.confirmar(usuario.id(), id, req);
    }

    @PostMapping("/{id}/recusar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public DoacaoResponse recusar(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id,
                                  @Valid @RequestBody MotivoRequest req) {
        return service.recusar(usuario.id(), id, req.motivo());
    }
}
