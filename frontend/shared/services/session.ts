import type { MeResponse } from "@/shared/types";

const KEY = "doacao.sessao";

export interface Sessao {
  token: string;
  usuario: MeResponse;
}

const listeners = new Set<() => void>();

export function subscribeSessao(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Texto bruto salvo (string estável, serve de snapshot). */
export function lerSessaoBruta(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function lerSessao(): Sessao | null {
  const raw = lerSessaoBruta();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Sessao;
  } catch {
    return null;
  }
}

export function salvarSessao(s: Sessao) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* armazenamento indisponível */
  }
  listeners.forEach((l) => l());
}

export function limparSessao() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* armazenamento indisponível */
  }
  listeners.forEach((l) => l());
}
