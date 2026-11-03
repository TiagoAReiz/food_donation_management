package reiz.food_donation_management.doador.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.dto.ExclusaoResponse;
import reiz.food_donation_management.doador.dto.DoadorRequest;
import reiz.food_donation_management.doador.dto.DoadorResponse;
import reiz.food_donation_management.doador.service.DoadorService;

import java.util.List;

@RestController
@RequestMapping("/api/doadores")
@RequiredArgsConstructor
public class DoadorController {

    private final DoadorService service;

    @GetMapping("/me")
    @PreAuthorize("hasRole('DOADOR')")
    public DoadorResponse me(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.buscarPorUsuario(usuario.id());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('DOADOR')")
    public DoadorResponse atualizarMe(@AuthenticationPrincipal UsuarioLogado usuario,
                                      @Valid @RequestBody DoadorRequest req) {
        return service.atualizarPorUsuario(usuario.id(), req);
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('DOADOR')")
    public ExclusaoResponse excluirMe(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.excluirPorUsuario(usuario.id());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<DoadorResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public DoadorResponse buscar(@PathVariable Integer id) {
        return service.buscar(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public DoadorResponse atualizar(@PathVariable Integer id, @Valid @RequestBody DoadorRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ExclusaoResponse excluir(@PathVariable Integer id) {
        return service.excluir(id);
    }
}
