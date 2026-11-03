package reiz.food_donation_management.entidade.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.dto.ExclusaoResponse;
import reiz.food_donation_management.entidade.dto.EntidadeRequest;
import reiz.food_donation_management.entidade.dto.EntidadeResponse;
import reiz.food_donation_management.entidade.service.EntidadeService;

import java.util.List;

@RestController
@RequestMapping("/api/entidades")
@RequiredArgsConstructor
public class EntidadeController {

    private final EntidadeService service;

    @GetMapping("/me")
    @PreAuthorize("hasRole('ENTIDADE')")
    public EntidadeResponse me(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.buscarPorUsuario(usuario.id());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ENTIDADE')")
    public EntidadeResponse atualizarMe(@AuthenticationPrincipal UsuarioLogado usuario,
                                        @Valid @RequestBody EntidadeRequest req) {
        return service.atualizarPorUsuario(usuario.id(), req);
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('ENTIDADE')")
    public ExclusaoResponse excluirMe(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.excluirPorUsuario(usuario.id());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<EntidadeResponse> listar(@RequestParam(required = false) Boolean aprovada) {
        return service.listar(aprovada);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public EntidadeResponse buscar(@PathVariable Integer id) {
        return service.buscar(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public EntidadeResponse atualizar(@PathVariable Integer id, @Valid @RequestBody EntidadeRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ExclusaoResponse excluir(@PathVariable Integer id) {
        return service.excluir(id);
    }

    @PostMapping("/{id}/aprovar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public EntidadeResponse aprovar(@PathVariable Integer id) {
        return service.aprovar(id);
    }

    @PostMapping("/{id}/recusar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void recusar(@PathVariable Integer id) {
        service.recusar(id);
    }
}
