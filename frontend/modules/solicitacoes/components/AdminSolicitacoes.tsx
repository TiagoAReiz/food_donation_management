"use client";

import { useState } from "react";
import { Check, Truck, X } from "lucide-react";
import { Abas } from "@/shared/components/ui/Abas";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Alerta, Card, PageHeader } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { SituacaoSolicitacaoBadge } from "@/shared/components/ui/Badge";
import { formatarData } from "@/shared/utils/format";
import type { SituacaoSolicitacao, SolicitacaoResponse } from "@/shared/types";
import { ItensDoPedido } from "./ItensDoPedido";
import { useAvaliarSolicitacao, useSolicitacoesAdmin } from "../hooks/useSolicitacoes";

type Filtro = SituacaoSolicitacao | "TODAS";

const ABAS: { valor: Filtro; texto: string }[] = [
  { valor: "PENDENTE", texto: "Para aprovar" },
  { valor: "APROVADA", texto: "Para entregar" },
  { valor: "ENTREGUE", texto: "Entregues" },
  { valor: "RECUSADA", texto: "Recusadas" },
  { valor: "CANCELADA", texto: "Canceladas" },
  { valor: "TODAS", texto: "Todas" },
];

function Pedido({ s, recarregar }: { s: SolicitacaoResponse; recarregar: () => void }) {
  const { aprovar, recusar, entregar, ocupado } = useAvaliarSolicitacao(recarregar);
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-lg font-extrabold">{s.entidade.nome}</p>
          <p className="text-base text-ink-soft">
            Pedido nº {s.id} · {formatarData(s.dataSolicitacao)}
            {s.dataEntrega && ` · entregue em ${formatarData(s.dataEntrega)}`}
          </p>
        </div>
        <SituacaoSolicitacaoBadge valor={s.situacao} />
      </div>
      <ItensDoPedido itens={s.itens} mostrarDisponivel={s.situacao === "PENDENTE"} />
      {s.situacao === "APROVADA" && (
        <p className="mt-2 text-base font-semibold text-blue-800">
          Estes alimentos estão reservados para esta entidade até a entrega.
        </p>
      )}
      {s.situacao === "RECUSADA" && s.motivoRecusa && (
        <div className="mt-2">
          <Alerta tom="erro" titulo="Motivo da recusa">
            {s.motivoRecusa}
          </Alerta>
        </div>
      )}
      {s.situacao === "PENDENTE" && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button carregando={ocupado} onClick={() => aprovar(s.id)} icone={<Check size={20} />}>
            Aprovar
          </Button>
          <Button variante="perigo" disabled={ocupado} onClick={() => recusar(s.id)} icone={<X size={20} />}>
            Recusar
          </Button>
        </div>
      )}
      {s.situacao === "APROVADA" && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button carregando={ocupado} onClick={() => entregar(s.id)} icone={<Truck size={20} />}>
            Registrar entrega
          </Button>
          <Button variante="fantasma" disabled={ocupado} onClick={() => recusar(s.id, true)} icone={<X size={20} />}>
            Cancelar pedido
          </Button>
        </div>
      )}
    </Card>
  );
}

export function AdminSolicitacoes() {
  const [filtro, setFiltro] = useState<Filtro>("PENDENTE");
  const { data, erro, carregando, recarregar } = useSolicitacoesAdmin(
    filtro === "TODAS" ? undefined : filtro,
  );
  return (
    <>
      <PageHeader titulo="Pedidos das entidades" subtitulo="Aprove, recuse e registre as entregas." />
      <Abas abas={ABAS} valor={filtro} onChange={setFiltro} rotulo="Filtrar pedidos" />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={<EmptyState titulo="Nenhum pedido aqui" texto="Quando houver pedidos nesta situação, eles aparecem nesta lista." />}
      >
        {(lista) => (
          <ul className="space-y-3">
            {lista.map((s) => (
              <li key={s.id}>
                <Pedido s={s} recarregar={recarregar} />
              </li>
            ))}
          </ul>
        )}
      </Carregavel>
    </>
  );
}
