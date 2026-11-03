import { api } from "@/shared/services/api";
import type { EstoqueItemResponse } from "@/shared/types";

export const estoqueService = {
  listar: () => api.get<EstoqueItemResponse[]>("/api/estoque").then((r) => r.data),
  vencidos: () => api.get<EstoqueItemResponse[]>("/api/estoque/vencidos").then((r) => r.data),
  corrigir: (id: number, qtdDisponivel: number) =>
    api.patch<EstoqueItemResponse>(`/api/estoque/${id}`, { qtdDisponivel }).then((r) => r.data),
  retirar: (id: number, motivo?: string) =>
    api
      .post<EstoqueItemResponse>(`/api/estoque/${id}/retirar`, { motivo })
      .then((r) => r.data),
};
