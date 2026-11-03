import { api } from "@/shared/services/api";
import type {
  CadastroDoadorRequest,
  CadastroEntidadeRequest,
  DoadorResponse,
  EntidadeResponse,
  LoginResponse,
  MeResponse,
} from "@/shared/types";

export const authService = {
  login: (email: string, senha: string) =>
    api.post<LoginResponse>("/api/auth/login", { email, senha }).then((r) => r.data),
  me: () => api.get<MeResponse>("/api/auth/me").then((r) => r.data),
  cadastrarDoador: (dados: CadastroDoadorRequest) =>
    api.post<DoadorResponse>("/api/auth/cadastro/doador", dados).then((r) => r.data),
  cadastrarEntidade: (dados: CadastroEntidadeRequest) =>
    api.post<EntidadeResponse>("/api/auth/cadastro/entidade", dados).then((r) => r.data),
};
