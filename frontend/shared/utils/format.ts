import type { Unidade } from "@/shared/types";

/** "2026-11-03" -> "03/11/2026" (sem passar por fuso horário). */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "-";
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

export function formatarDataHora(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return formatarData(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function hojeIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Dias entre hoje e a data (negativo = já passou). */
export function diasAte(iso: string): number {
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  const alvo = Date.UTC(a, m - 1, d);
  const h = new Date();
  const hoje = Date.UTC(h.getFullYear(), h.getMonth(), h.getDate());
  return Math.round((alvo - hoje) / 86400000);
}

const SIGLAS: Record<Unidade, [string, string]> = {
  KG: ["kg", "kg"],
  G: ["g", "g"],
  L: ["L", "L"],
  ML: ["mL", "mL"],
  UNIDADE: ["unidade", "unidades"],
  PACOTE: ["pacote", "pacotes"],
  CAIXA: ["caixa", "caixas"],
};

export function formatarNumero(n: number): string {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}

export function formatarQtd(n: number, unidade: Unidade): string {
  const [s, p] = SIGLAS[unidade];
  return `${formatarNumero(n)} ${n === 1 ? s : p}`;
}

export function siglaUnidade(unidade: Unidade): string {
  return SIGLAS[unidade][1];
}

/** Converte texto digitado ("1,5") em número. */
export function lerNumero(txt: string): number {
  return Number(txt.replace(",", "."));
}
