package reiz.food_donation_management.common.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.doacao.entity.*;
import reiz.food_donation_management.doacao.repository.DoacaoRepository;
import reiz.food_donation_management.doador.entity.Doador;
import reiz.food_donation_management.doador.entity.TipoPessoa;
import reiz.food_donation_management.doador.repository.DoadorRepository;
import reiz.food_donation_management.entidade.entity.Entidade;
import reiz.food_donation_management.entidade.repository.EntidadeRepository;
import reiz.food_donation_management.solicitacao.entity.ItemSolicitacao;
import reiz.food_donation_management.solicitacao.entity.Solicitacao;
import reiz.food_donation_management.solicitacao.repository.SolicitacaoRepository;
import reiz.food_donation_management.usuario.entity.Perfil;
import reiz.food_donation_management.usuario.entity.Usuario;
import reiz.food_donation_management.usuario.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Cria os dados iniciais de desenvolvimento quando o banco está vazio. */
@Slf4j
@Component
@RequiredArgsConstructor
public class SeedRunner implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final DoadorRepository doadorRepository;
    private final EntidadeRepository entidadeRepository;
    private final DoacaoRepository doacaoRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }
        LocalDate hoje = DataUtil.hoje();
        String hashAdmin = passwordEncoder.encode("admin123");
        String hash = passwordEncoder.encode("senha123");

        Usuario admin = usuarioRepository.save(usuario("Administrador", "admin@doacao.org", hashAdmin, null, Perfil.ADMINISTRADOR));

        Doador bomPreco = doadorRepository.save(Doador.builder()
                .usuario(usuario("Mercado Bom Preço", "contato@bompreco.com", hash, "11 4000-1000", Perfil.DOADOR))
                .tipoPessoa(TipoPessoa.JURIDICA).documento("12.345.678/0001-95")
                .endereco("Av. Alphaville, 100 - Barueri/SP").build());
        Doador maria = doadorRepository.save(Doador.builder()
                .usuario(usuario("Maria Souza", "maria@email.com", hash, null, Perfil.DOADOR))
                .tipoPessoa(TipoPessoa.FISICA).documento("123.456.789-09").build());

        Entidade creche = entidadeRepository.save(Entidade.builder()
                .usuario(usuario("Creche Sol Nascente", "creche@sol.org", hash, "11 4000-2000", Perfil.ENTIDADE))
                .cnpj("98.765.432/0001-98").endereco("Rua das Flores, 50 - Barueri/SP")
                .responsavel("Ana Lima").pessoasAtendidas(80).aprovada(true).build());
        entidadeRepository.save(Entidade.builder()
                .usuario(usuario("Abrigo Esperança", "abrigo@esperanca.org", hash, null, Perfil.ENTIDADE))
                .cnpj("11.222.333/0001-81").endereco("Rua Central, 200 - Santana de Parnaíba/SP")
                .responsavel("João Reis").pessoasAtendidas(40).aprovada(false).build());

        Doacao recebida = Doacao.builder().doador(bomPreco).dataDoacao(hoje.minusDays(2))
                .situacao(SituacaoDoacao.RECEBIDA).recebidaEm(DataUtil.agora().minusDays(1)).recebidaPor(admin).build();
        recebida.adicionarAlimento(lote("Arroz tipo 1", Categoria.GRAOS, "20", Unidade.KG, hoje.plusDays(120), true));
        recebida.adicionarAlimento(lote("Feijão carioca", Categoria.GRAOS, "10", Unidade.KG, hoje.plusDays(70), true));
        recebida.adicionarAlimento(lote("Leite integral", Categoria.LATICINIOS, "24", Unidade.L, hoje.plusDays(30), true));
        doacaoRepository.save(recebida);

        Doacao pendente = Doacao.builder().doador(maria).dataDoacao(hoje).build();
        pendente.adicionarAlimento(lote("Molho de tomate", Categoria.ENLATADOS, "12", Unidade.UNIDADE, hoje.plusDays(200), false));
        doacaoRepository.save(pendente);

        Solicitacao solicitacao = Solicitacao.builder().entidade(creche).dataSolicitacao(hoje).build();
        Alimento feijao = recebida.getAlimentos().get(1);
        Alimento leite = recebida.getAlimentos().get(2);
        solicitacao.adicionarItem(ItemSolicitacao.builder().alimento(leite).quantidade(new BigDecimal("12")).build());
        solicitacao.adicionarItem(ItemSolicitacao.builder().alimento(feijao).quantidade(new BigDecimal("5")).build());
        solicitacaoRepository.save(solicitacao);

        log.info("Dados iniciais criados (admin@doacao.org / admin123).");
    }

    private Usuario usuario(String nome, String email, String hash, String telefone, Perfil perfil) {
        return Usuario.builder().nome(nome).email(email).senhaHash(hash).telefone(telefone)
                .perfil(perfil).ativo(true).build();
    }

    private Alimento lote(String nome, Categoria categoria, String quantidade, Unidade unidade,
                          LocalDate validade, boolean emEstoque) {
        BigDecimal qtd = new BigDecimal(quantidade);
        return Alimento.builder().nome(nome).categoria(categoria).quantidade(qtd).unidade(unidade)
                .validade(validade).qtdDisponivel(emEstoque ? qtd : BigDecimal.ZERO).build();
    }
}
