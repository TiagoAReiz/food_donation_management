package reiz.food_donation_management.painel.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.painel.service.PainelService;

import java.util.Map;

@RestController
@RequestMapping("/api/painel")
@RequiredArgsConstructor
public class PainelController {

    private final PainelService service;

    @GetMapping
    public Map<String, Object> painel(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.resumo(usuario);
    }
}
