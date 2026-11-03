package reiz.food_donation_management.administrador.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reiz.food_donation_management.administrador.dto.AdministradorRequest;
import reiz.food_donation_management.administrador.dto.UsuarioResponse;
import reiz.food_donation_management.administrador.service.AdministradorService;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.common.dto.ExclusaoResponse;

import java.util.List;

@RestController
@RequestMapping("/api/administradores")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdministradorController {

    private final AdministradorService service;

    @GetMapping
    public List<UsuarioResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscar(@PathVariable Integer id) {
        return service.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse criar(@Valid @RequestBody AdministradorRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizar(@PathVariable Integer id, @Valid @RequestBody AdministradorRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ExclusaoResponse excluir(@AuthenticationPrincipal UsuarioLogado usuario, @PathVariable Integer id) {
        return service.excluir(usuario.id(), id);
    }
}
