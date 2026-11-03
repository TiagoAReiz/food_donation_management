import { api } from "@/shared/services/api";
import type {
  DoadorRequest,
  DoadorResponse,
  EntidadeRequest,
  EntidadeResponse,
  ExclusaoResponse,
} from "@/shared/types";

export const perfilService = {
  doador: () => api.get<DoadorResponse>("/api/doadores/me").then((r) => r.data),
  atualizarDoador: (d: DoadorRequest) =>
    api.put<DoadorResponse>("/api/doadores/me", d).then((r) => r.data),
  excluirDoador: () => api.delete<ExclusaoResponse>("/api/doadores/me").then((r) => r.data),

  entidade: () => api.get<EntidadeResponse>("/api/entidades/me").then((r) => r.data),
  atualizarEntidade: (d: EntidadeRequest) =>
    api.put<EntidadeResponse>("/api/entidades/me", d).then((r) => r.data),
  excluirEntidade: () => api.delete<ExclusaoResponse>("/api/entidades/me").then((r) => r.data),
};
