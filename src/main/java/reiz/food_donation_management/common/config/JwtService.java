package reiz.food_donation_management.common.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reiz.food_donation_management.usuario.entity.Usuario;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtService {

    private final SecretKey chave;
    private final Duration validade;

    public JwtService(@Value("${app.jwt.secret}") String segredo,
                      @Value("${app.jwt.expiration-hours:8}") long horas) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.validade = Duration.ofHours(horas);
    }

    public String gerar(Usuario usuario) {
        Date agora = new Date();
        return Jwts.builder()
                .subject(String.valueOf(usuario.getId()))
                .claim("perfil", usuario.getPerfil().name())
                .issuedAt(agora)
                .expiration(new Date(agora.getTime() + validade.toMillis()))
                .signWith(chave)
                .compact();
    }

    /** Devolve o id do usuário se o token for válido e não expirado. */
    public Optional<Integer> validar(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(chave).build().parseSignedClaims(token).getPayload();
            return Optional.of(Integer.valueOf(claims.getSubject()));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
