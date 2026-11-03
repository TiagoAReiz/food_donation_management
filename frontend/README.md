# Alimento Solidário - Frontend

Next.js + Tailwind CSS consumindo a API REST (Spring Boot).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

A URL da API vem de `NEXT_PUBLIC_API_URL` (padrão `http://localhost:8080`).

## Estrutura

- `app/` rotas finas: `(public)` (início, login, cadastros) e `(private)` (`/doador`, `/entidade`, `/admin`)
- `modules/<modulo>/{services,hooks,components}` telas e chamadas à API (axios) de cada área
- `shared/` componentes de UI, cliente axios, hooks, tipos e utilitários

## Docker

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 -t doacao-frontend .
```
