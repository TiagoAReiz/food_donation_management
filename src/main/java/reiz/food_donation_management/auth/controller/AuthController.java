package reiz.food_donation_management.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reiz.food_donation_management.auth.dto.*;
import reiz.food_donation_management.auth.service.AuthService;
import reiz.food_donation_management.common.config.UsuarioLogado;
import reiz.food_donation_management.doador.dto.DoadorResponse;
import reiz.food_donation_management.entidade.dto.EntidadeResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return service.login(req);
    }

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal UsuarioLogado usuario) {
        return service.me(usuario.id());
    }

    @PostMapping("/cadastro/doador")
    @ResponseStatus(HttpStatus.CREATED)
    public DoadorResponse cadastrarDoador(@Valid @RequestBody CadastroDoadorRequest req) {
        return service.cadastrarDoador(req);
    }

    @PostMapping("/cadastro/entidade")
    @ResponseStatus(HttpStatus.CREATED)
    public EntidadeResponse cadastrarEntidade(@Valid @RequestBody CadastroEntidadeRequest req) {
        return service.cadastrarEntidade(req);
    }
}
