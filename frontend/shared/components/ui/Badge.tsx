import type { ReactNode } from "react";
import type {
  SituacaoDoacao,
  SituacaoSolicitacao,
} from "@/shared/types";
import {
  SITUACAO_DOACAO,
  SITUACAO_SOLICITACAO,
  type Tom,
} from "@/shared/utils/labels";
import { diasAte, formatarData } from "@/shared/utils/format";

const TONS: Record<Tom, string> = {
  amarelo: "bg-amber-100 text-amber-900 ring-amber-300",
  azul: "bg-blue-100 text-blue-900 ring-blue-300",
  verde: "bg-green-100 text-green-900 ring-green-300",
  vermelho: "bg-red-100 text-red-900 ring-red-300",
  cinza: "bg-stone-200 text-stone-800 ring-stone-300",
};

export function Badge({ tom, children }: { tom: Tom; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset ${TONS[tom]}`}
    >
      {children}
    </span>
  );
}

export function SituacaoDoacaoBadge({ valor }: { valor: SituacaoDoacao }) {
  const s = SITUACAO_DOACAO[valor];
  return <Badge tom={s.tom}>{s.texto}</Badge>;
}

export function SituacaoSolicitacaoBadge({ valor }: { valor: SituacaoSolicitacao }) {
  const s = SITUACAO_SOLICITACAO[valor];
  return <Badge tom={s.tom}>{s.texto}</Badge>;
}

/** Validade com destaque: vencido (vermelho), vence em até 7 dias (âmbar). */
export function ValidadeBadge({ validade }: { validade: string }) {
  const dias = diasAte(validade);
  if (dias < 0) return <Badge tom="vermelho">Vencido em {formatarData(validade)}</Badge>;
  if (dias === 0) return <Badge tom="vermelho">Vence hoje</Badge>;
  if (dias === 1) return <Badge tom="amarelo">Vence amanhã</Badge>;
  if (dias <= 7) return <Badge tom="amarelo">Vence em {dias} dias</Badge>;
  return <span className="text-base text-ink">Validade: {formatarData(validade)}</span>;
}
