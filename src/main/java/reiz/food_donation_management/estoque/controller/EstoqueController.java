package reiz.food_donation_management.estoque.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.estoque.dto.AjusteEstoqueRequest;
import reiz.food_donation_management.estoque.dto.EstoqueItemResponse;
import reiz.food_donation_management.estoque.dto.RetiradaRequest;
import reiz.food_donation_management.estoque.service.EstoqueService;

import reiz.food_donation_management.usuario.entity.Perfil;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','ENTIDADE')")
    public List<EstoqueItemResponse> listar(@AuthenticationPrincipal UsuarioLogado usuario) {
        return usuario.perfil() == Perfil.ADMINISTRADOR ? service.listar() : service.listarLivre();
    }

    @GetMapping("/vencidos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<EstoqueItemResponse> vencidos() {
        return service.vencidos();
    }

    @PatchMapping("/{alimentoId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public EstoqueItemResponse ajustar(@PathVariable Integer alimentoId,
                                       @Valid @RequestBody AjusteEstoqueRequest req) {
        return service.ajustar(alimentoId, req.qtdEmEstoque());
    }

    @PostMapping("/{alimentoId}/retirar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public EstoqueItemResponse retirar(@PathVariable Integer alimentoId,
                                       @Valid @RequestBody(required = false) RetiradaRequest req) {
        return service.retirar(alimentoId, req == null ? null : req.motivo());
    }
}
