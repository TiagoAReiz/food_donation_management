import { api } from "@/shared/services/api";
import type {
  DoacaoRequest,
  DoacaoResponse,
  MeuAlimentoResponse,
  SituacaoDoacao,
} from "@/shared/types";

export const doacaoService = {
  minhas: () => api.get<DoacaoResponse[]>("/api/doacoes/minhas").then((r) => r.data),
  meusAlimentos: () =>
    api.get<MeuAlimentoResponse[]>("/api/doacoes/meus-alimentos").then((r) => r.data),
  buscar: (id: number) => api.get<DoacaoResponse>(`/api/doacoes/${id}`).then((r) => r.data),
  criar: (dados: DoacaoRequest) =>
    api.post<DoacaoResponse>("/api/doacoes", dados).then((r) => r.data),
  atualizar: (id: number, dados: DoacaoRequest) =>
    api.put<DoacaoResponse>(`/api/doacoes/${id}`, dados).then((r) => r.data),
  cancelar: (id: number) =>
    api.post<DoacaoResponse>(`/api/doacoes/${id}/cancelar`).then((r) => r.data),

  // administrador
  listar: (situacao?: SituacaoDoacao) =>
    api
      .get<DoacaoResponse[]>("/api/doacoes", { params: situacao ? { situacao } : undefined })
      .then((r) => r.data),
  confirmar: (id: number, alimentos?: { id: number; quantidade: number }[]) =>
    api.post<DoacaoResponse>(`/api/doacoes/${id}/confirmar`, { alimentos }).then((r) => r.data),
  recusar: (id: number, motivo: string) =>
    api.post<DoacaoResponse>(`/api/doacoes/${id}/recusar`, { motivo }).then((r) => r.data),
};
