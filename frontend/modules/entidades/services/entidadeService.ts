import { api } from "@/shared/services/api";
import type { EntidadeRequest, EntidadeResponse, ExclusaoResponse } from "@/shared/types";

/** Operações do administrador sobre entidades. */
export const entidadeService = {
  listar: (aprovada?: boolean) =>
    api
      .get<EntidadeResponse[]>("/api/entidades", {
        params: aprovada === undefined ? undefined : { aprovada },
      })
      .then((r) => r.data),
  atualizar: (id: number, d: EntidadeRequest) =>
    api.put<EntidadeResponse>(`/api/entidades/${id}`, d).then((r) => r.data),
  excluir: (id: number) =>
    api.delete<ExclusaoResponse>(`/api/entidades/${id}`).then((r) => r.data),
  aprovar: (id: number) =>
    api.post<EntidadeResponse>(`/api/entidades/${id}/aprovar`).then((r) => r.data),
  recusar: (id: number) => api.post<void>(`/api/entidades/${id}/recusar`).then(() => undefined),
};
