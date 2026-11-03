import type {
  Categoria,
  Perfil,
  SituacaoDoacao,
  SituacaoSolicitacao,
  TipoPessoa,
  Unidade,
} from "@/shared/types";

export type Tom = "amarelo" | "azul" | "verde" | "vermelho" | "cinza";

export const CATEGORIAS: Record<Categoria, string> = {
  GRAOS: "Grãos",
  ENLATADOS: "Enlatados",
  LATICINIOS: "Laticínios",
  CARNES: "Carnes",
  HORTIFRUTI: "Hortifrúti",
  BEBIDAS: "Bebidas",
  OUTROS: "Outros",
};

export const UNIDADES: Record<Unidade, string> = {
  KG: "Quilo (kg)",
  G: "Grama (g)",
  L: "Litro (L)",
  ML: "Mililitro (mL)",
  UNIDADE: "Unidade",
  PACOTE: "Pacote",
  CAIXA: "Caixa",
};

export const TIPOS_PESSOA: Record<TipoPessoa, string> = {
  FISICA: "Pessoa física",
  JURIDICA: "Empresa (pessoa jurídica)",
};

export const PERFIS: Record<Perfil, string> = {
  ADMINISTRADOR: "Administrador",
  DOADOR: "Doador",
  ENTIDADE: "Entidade",
};

export const SITUACAO_DOACAO: Record<SituacaoDoacao, { texto: string; tom: Tom }> = {
  PENDENTE: { texto: "Aguardando conferência", tom: "amarelo" },
  RECEBIDA: { texto: "Recebida", tom: "azul" },
  RECUSADA: { texto: "Recusada", tom: "vermelho" },
  CANCELADA: { texto: "Cancelada", tom: "cinza" },
};

export const SITUACAO_SOLICITACAO: Record<
  SituacaoSolicitacao,
  { texto: string; tom: Tom }
> = {
  PENDENTE: { texto: "Aguardando aprovação", tom: "amarelo" },
  APROVADA: { texto: "Aprovada", tom: "azul" },
  ENTREGUE: { texto: "Entregue", tom: "verde" },
  RECUSADA: { texto: "Recusada", tom: "vermelho" },
  CANCELADA: { texto: "Cancelada", tom: "cinza" },
};

export function rotaInicial(perfil: Perfil): string {
  switch (perfil) {
    case "ADMINISTRADOR":
      return "/admin";
    case "DOADOR":
      return "/doador";
    case "ENTIDADE":
      return "/entidade";
  }
}
