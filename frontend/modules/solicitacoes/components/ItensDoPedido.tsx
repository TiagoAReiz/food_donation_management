import { CATEGORIAS } from "@/shared/utils/labels";
import { formatarQtd } from "@/shared/utils/format";
import { ValidadeBadge } from "@/shared/components/ui/Badge";
import type { ItemSolicitacaoResponse } from "@/shared/types";

export function ItensDoPedido({
  itens,
  mostrarDisponivel,
}: {
  itens: ItemSolicitacaoResponse[];
  mostrarDisponivel?: boolean;
}) {
  return (
    <ul className="divide-y divide-stone-200">
      {itens.map((i) => (
        <li key={i.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-extrabold">{i.nome}</p>
            <p className="text-base text-ink-soft">
              {CATEGORIAS[i.categoria]} · pedido: <strong>{formatarQtd(i.quantidade, i.unidade)}</strong>
              {mostrarDisponivel && ` · disponível agora: ${formatarQtd(i.qtdDisponivel, i.unidade)}`}
            </p>
          </div>
          <ValidadeBadge validade={i.validade} />
        </li>
      ))}
    </ul>
  );
}
