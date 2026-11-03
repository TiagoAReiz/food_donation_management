import { api } from "@/shared/services/api";
import type { AdministradorRequest, ExclusaoResponse, UsuarioResponse } from "@/shared/types";

export const administradorService = {
  listar: () => api.get<UsuarioResponse[]>("/api/administradores").then((r) => r.data),
  criar: (d: AdministradorRequest) =>
    api.post<UsuarioResponse>("/api/administradores", d).then((r) => r.data),
  atualizar: (id: number, d: AdministradorRequest) =>
    api.put<UsuarioResponse>(`/api/administradores/${id}`, d).then((r) => r.data),
  excluir: (id: number) =>
    api.delete<ExclusaoResponse>(`/api/administradores/${id}`).then((r) => r.data),
};
