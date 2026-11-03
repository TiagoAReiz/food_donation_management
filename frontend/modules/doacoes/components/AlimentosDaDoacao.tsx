import { CATEGORIAS } from "@/shared/utils/labels";
import { formatarQtd } from "@/shared/utils/format";
import { ValidadeBadge } from "@/shared/components/ui/Badge";
import type { AlimentoResponse } from "@/shared/types";

export function AlimentosDaDoacao({
  alimentos,
  mostrarDisponivel,
}: {
  alimentos: AlimentoResponse[];
  mostrarDisponivel?: boolean;
}) {
  return (
    <ul className="divide-y divide-stone-200">
      {alimentos.map((a) => (
        <li key={a.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-extrabold text-ink">{a.nome}</p>
            <p className="text-base text-ink-soft">
              {CATEGORIAS[a.categoria]} · {formatarQtd(a.quantidade, a.unidade)}
              {mostrarDisponivel && ` · ainda disponível: ${formatarQtd(a.qtdDisponivel, a.unidade)}`}
            </p>
          </div>
          <ValidadeBadge validade={a.validade} />
        </li>
      ))}
    </ul>
  );
}
