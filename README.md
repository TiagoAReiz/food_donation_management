# Alimento Solidário — Gestão de Doação de Alimentos

Sistema web para registrar doações de alimentos, controlar o estoque e atender às solicitações de entidades beneficiárias (creches, abrigos, cozinhas comunitárias). Projeto acadêmico — Universidade Presbiteriana Mackenzie, 2026.

## Stack

- **Backend:** Java 17, Spring Boot 4 (Web MVC, Data JPA, Security com JWT, Validation), Flyway, Lombok
- **Banco:** PostgreSQL 17
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, axios

## Como rodar

```bash
docker compose up --watch
```

- Frontend: http://localhost:3000
- API: http://localhost:8080/api

O ambiente roda com hot reload: deixe o terminal aberto enquanto desenvolve. Alterações em `frontend/` aparecem na hora via HMR do Next; alterações em `src/` são recompiladas e o Spring DevTools reinicia o backend (alguns segundos). Mudanças no `pom.xml` ou `package.json` reconstroem a imagem automaticamente.

Alternativamente, para desenvolver sem Docker, suba só o banco (`docker compose up -d postgres`), rode o backend com `./mvnw spring-boot:run` e o frontend com `cd frontend && npm install && npm run dev`.

## Usuários de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@doacao.org | admin123 |
| Doador (PJ) | contato@bompreco.com | senha123 |
| Doador (PF) | maria@email.com | senha123 |
| Entidade aprovada | creche@sol.org | senha123 |
| Entidade aguardando aprovação | abrigo@esperanca.org | senha123 |

Os dados de exemplo são criados automaticamente quando o banco está vazio.

## Estrutura

```
src/main/java/reiz/food_donation_management/
  auth, administrador, doador, entidade, doacao, estoque, solicitacao, painel, usuario
    └── controller / service / repository / entity / dto
  common/ (config, segurança, exceções, utilitários)
frontend/
  app/(public)   páginas sem login
  app/(private)  páginas com login (doador, entidade, admin)
  modules/<modulo>/{services,hooks,components}
  shared/        UI, cliente axios, hooks, tipos e utilitários
```

## Testes

```bash
./mvnw test
```
