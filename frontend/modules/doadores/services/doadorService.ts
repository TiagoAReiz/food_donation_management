import { api } from "@/shared/services/api";
import type { DoadorRequest, DoadorResponse, ExclusaoResponse } from "@/shared/types";

/** Operações do administrador sobre doadores. */
export const doadorService = {
  listar: () => api.get<DoadorResponse[]>("/api/doadores").then((r) => r.data),
  atualizar: (id: number, d: DoadorRequest) =>
    api.put<DoadorResponse>(`/api/doadores/${id}`, d).then((r) => r.data),
  excluir: (id: number) =>
    api.delete<ExclusaoResponse>(`/api/doadores/${id}`).then((r) => r.data),
};
