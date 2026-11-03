"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  lerSessaoBruta,
  limparSessao,
  salvarSessao,
  subscribeSessao,
  type Sessao,
} from "@/shared/services/session";
import type { MeResponse } from "@/shared/types";
import { authService } from "../services/authService";

interface AuthApi {
  /** false até o navegador ler a sessão salva (evita redirecionar cedo demais). */
  pronto: boolean;
  usuario: MeResponse | null;
  login: (email: string, senha: string) => Promise<MeResponse>;
  logout: () => void;
  atualizar: () => Promise<void>;
}

const Ctx = createContext<AuthApi | null>(null);

const semAssinatura = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const bruta = useSyncExternalStore(subscribeSessao, lerSessaoBruta, () => null);
  const pronto = useSyncExternalStore(
    semAssinatura,
    () => true,
    () => false,
  );

  const usuario = useMemo<MeResponse | null>(() => {
    if (!bruta) return null;
    try {
      return (JSON.parse(bruta) as Sessao).usuario;
    } catch {
      return null;
    }
  }, [bruta]);

  const login = useCallback(async (email: string, senha: string) => {
    const r = await authService.login(email, senha);
    salvarSessao({ token: r.token, usuario: r.usuario });
    return r.usuario;
  }, []);

  const atualizar = useCallback(async () => {
    const atual = bruta ? (JSON.parse(bruta) as Sessao) : null;
    if (!atual) return;
    const me = await authService.me();
    salvarSessao({ token: atual.token, usuario: me });
  }, [bruta]);

  const value = useMemo(
    () => ({ pronto, usuario, login, logout: limparSessao, atualizar }),
    [pronto, usuario, login, atualizar],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth fora do AuthProvider");
  return c;
}
