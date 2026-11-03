import { api } from "@/shared/services/api";
import type {
  SituacaoSolicitacao,
  SolicitacaoRequest,
  SolicitacaoResponse,
} from "@/shared/types";

export const solicitacaoService = {
  minhas: () => api.get<SolicitacaoResponse[]>("/api/solicitacoes/minhas").then((r) => r.data),
  buscar: (id: number) =>
    api.get<SolicitacaoResponse>(`/api/solicitacoes/${id}`).then((r) => r.data),
  criar: (d: SolicitacaoRequest) =>
    api.post<SolicitacaoResponse>("/api/solicitacoes", d).then((r) => r.data),
  atualizar: (id: number, d: SolicitacaoRequest) =>
    api.put<SolicitacaoResponse>(`/api/solicitacoes/${id}`, d).then((r) => r.data),
  cancelar: (id: number) =>
    api.post<SolicitacaoResponse>(`/api/solicitacoes/${id}/cancelar`).then((r) => r.data),

  // administrador
  listar: (situacao?: SituacaoSolicitacao) =>
    api
      .get<SolicitacaoResponse[]>("/api/solicitacoes", {
        params: situacao ? { situacao } : undefined,
      })
      .then((r) => r.data),
  aprovar: (id: number) =>
    api.post<SolicitacaoResponse>(`/api/solicitacoes/${id}/aprovar`).then((r) => r.data),
  recusar: (id: number, motivo: string) =>
    api.post<SolicitacaoResponse>(`/api/solicitacoes/${id}/recusar`, { motivo }).then((r) => r.data),
  entregar: (id: number) =>
    api.post<SolicitacaoResponse>(`/api/solicitacoes/${id}/entregar`).then((r) => r.data),
};
