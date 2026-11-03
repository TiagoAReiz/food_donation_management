export type Perfil = "ADMINISTRADOR" | "DOADOR" | "ENTIDADE";
export type TipoPessoa = "FISICA" | "JURIDICA";
export type SituacaoDoacao = "PENDENTE" | "RECEBIDA" | "RECUSADA" | "CANCELADA";
export type SituacaoSolicitacao =
  | "PENDENTE"
  | "APROVADA"
  | "RECUSADA"
  | "ENTREGUE"
  | "CANCELADA";
export type Categoria =
  | "GRAOS"
  | "ENLATADOS"
  | "LATICINIOS"
  | "CARNES"
  | "HORTIFRUTI"
  | "BEBIDAS"
  | "OUTROS";
export type Unidade = "KG" | "G" | "L" | "ML" | "UNIDADE" | "PACOTE" | "CAIXA";

export interface UsuarioResumo {
  id: number;
  nome: string;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  perfil: Perfil;
  ativo: boolean;
  criadoEm: string;
}

export interface MeResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  perfil: Perfil;
  doadorId: number | null;
  entidadeId: number | null;
  entidadeAprovada: boolean | null;
}

export interface DoadorResponse {
  id: number;
  usuarioId: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipoPessoa: TipoPessoa;
  documento: string;
  endereco: string | null;
  ativo: boolean;
  criadoEm: string;
}

export interface EntidadeResponse {
  id: number;
  usuarioId: number;
  nome: string;
  email: string;
  telefone: string | null;
  cnpj: string;
  endereco: string;
  responsavel: string;
  pessoasAtendidas: number;
  aprovada: boolean;
  ativo: boolean;
  criadoEm: string;
}

export interface AlimentoResponse {
  id: number;
  nome: string;
  categoria: Categoria;
  quantidade: number;
  unidade: Unidade;
  validade: string;
  qtdDisponivel: number;
}

export interface DoacaoResponse {
  id: number;
  doador: UsuarioResumo;
  dataDoacao: string;
  situacao: SituacaoDoacao;
  recebidaEm: string | null;
  recebidaPor: UsuarioResumo | null;
  observacao: string | null;
  alimentos: AlimentoResponse[];
}

export interface EstoqueItemResponse {
  id: number;
  nome: string;
  categoria: Categoria;
  qtdDisponivel: number;
  unidade: Unidade;
  validade: string;
  doacaoId: number;
  diasParaVencer: number;
}

export interface MeuAlimentoResponse {
  id: number;
  doacaoId: number;
  nome: string;
  categoria: Categoria;
  quantidade: number;
  qtdDisponivel: number;
  unidade: Unidade;
  validade: string;
  situacaoDoacao: SituacaoDoacao;
  dataDoacao: string;
}

export interface ItemSolicitacaoResponse {
  id: number;
  alimentoId: number;
  nome: string;
  categoria: Categoria;
  unidade: Unidade;
  validade: string;
  quantidade: number;
  qtdDisponivel: number;
}

export interface SolicitacaoResponse {
  id: number;
  entidade: UsuarioResumo;
  dataSolicitacao: string;
  situacao: SituacaoSolicitacao;
  avaliadaPor: UsuarioResumo | null;
  dataEntrega: string | null;
  motivoRecusa: string | null;
  itens: ItemSolicitacaoResponse[];
}

export interface ExclusaoResponse {
  resultado: "EXCLUIDO" | "DESATIVADO";
  mensagem: string;
}

export interface LoginResponse {
  token: string;
  usuario: MeResponse;
}

export interface PainelResponse {
  // admin
  doacoesPendentes?: number;
  solicitacoesPendentes?: number;
  solicitacoesAprovadas?: number;
  entidadesPendentes?: number;
  lotesEmEstoque?: number;
  lotesVencidos?: number;
  lotesVencendo7Dias?: number;
  // doador
  doacoesRecebidas?: number;
  totalDoacoes?: number;
  lotesAindaEmEstoque?: number;
  // entidade
  aprovada?: boolean;
  solicitacoesEntregues?: number;
  lotesDisponiveis?: number;
}

/* Requests */
export interface AlimentoRequest {
  nome: string;
  categoria: Categoria;
  quantidade: number;
  unidade: Unidade;
  validade: string;
}
export interface DoacaoRequest {
  observacao?: string;
  alimentos: AlimentoRequest[];
}
export interface SolicitacaoRequest {
  itens: { alimentoId: number; quantidade: number }[];
}
export interface DoadorRequest {
  nome: string;
  email: string;
  telefone?: string;
  tipoPessoa: TipoPessoa;
  documento: string;
  endereco?: string;
  senha?: string;
}
export interface CadastroDoadorRequest extends DoadorRequest {
  senha: string;
}
export interface EntidadeRequest {
  nome: string;
  email: string;
  telefone?: string;
  cnpj: string;
  endereco: string;
  responsavel: string;
  pessoasAtendidas: number;
  senha?: string;
}
export interface CadastroEntidadeRequest extends EntidadeRequest {
  senha: string;
}
export interface AdministradorRequest {
  nome: string;
  email: string;
  telefone?: string;
  senha?: string;
}
