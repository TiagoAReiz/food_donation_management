import axios, { AxiosError } from "axios";
import { lerSessao, limparSessao } from "./session";

export class ApiError extends Error {
  status: number;
  campos?: Record<string, string>;
  constructor(status: number, mensagem: string, campos?: Record<string, string>) {
    super(mensagem);
    this.name = "ApiError";
    this.status = status;
    this.campos = campos;
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const sessao = lerSessao();
  if (sessao?.token) config.headers.Authorization = `Bearer ${sessao.token}`;
  return config;
});

type CorpoErro = {
  status?: number;
  mensagem?: string;
  campos?: Record<string, string>;
};

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<CorpoErro>) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError(
          0,
          "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",
        ),
      );
    }
    const { status, data } = error.response;
    if (status === 401 && lerSessao()) {
      // Sessão inválida: ao limpar, a guarda de rota leva para /login.
      limparSessao();
    }
    return Promise.reject(
      new ApiError(
        status,
        data?.mensagem ?? "Algo deu errado. Tente novamente em instantes.",
        data?.campos,
      ),
    );
  },
);

export function mensagemDeErro(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  return "Algo deu errado. Tente novamente em instantes.";
}
