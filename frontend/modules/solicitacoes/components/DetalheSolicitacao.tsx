"use client";

import { ArrowLeft, Pencil, XCircle } from "lucide-react";
import { Carregavel } from "@/shared/components/ui/Estados";
import { Alerta, Card, PageHeader } from "@/shared/components/ui/Card";
import { Button, LinkButton } from "@/shared/components/ui/Button";
import { SituacaoSolicitacaoBadge } from "@/shared/components/ui/Badge";
import { formatarData } from "@/shared/utils/format";
import type { SolicitacaoResponse } from "@/shared/types";
import { ItensDoPedido } from "./ItensDoPedido";
import { useCancelarSolicitacao, useSolicitacao } from "../hooks/useSolicitacoes";

const TEXTO: Record<string, string> = {
  PENDENTE: "Nossa equipe vai analisar o pedido em breve.",
  APROVADA: "Pedido aprovado! Em breve combinaremos a entrega.",
};

function Conteudo({ s, recarregar }: { s: SolicitacaoResponse; recarregar: () => void }) {
  const { cancelar, ocupado } = useCancelarSolicitacao(s.id, recarregar);
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <SituacaoSolicitacaoBadge valor={s.situacao} />
          <span className="text-base text-ink-soft">Feito em {formatarData(s.dataSolicitacao)}</span>
        </div>
        {TEXTO[s.situacao] && <p className="mt-2 text-base text-ink-soft">{TEXTO[s.situacao]}</p>}
        {s.dataEntrega && (
          <p className="mt-2 text-base font-bold text-green-800">
            Entregue em {formatarData(s.dataEntrega)}
          </p>
        )}
      </Card>

      {s.situacao === "RECUSADA" && s.motivoRecusa && (
        <Alerta tom="erro" titulo="Motivo da recusa">
          {s.motivoRecusa}
        </Alerta>
      )}

      <Card>
        <h2 className="text-lg font-extrabold">Alimentos pedidos</h2>
        <ItensDoPedido itens={s.itens} mostrarDisponivel={s.situacao === "PENDENTE"} />
      </Card>

      {s.situacao === "PENDENTE" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href={`/entidade/solicitacoes/${s.id}/editar`} icone={<Pencil size={18} />}>
            Editar pedido
          </LinkButton>
          <Button variante="perigo" carregando={ocupado} onClick={cancelar} icone={<XCircle size={18} />}>
            Cancelar pedido
          </Button>
        </div>
      )}
    </div>
  );
}

export function DetalheSolicitacao({ id }: { id: number }) {
  const { data, erro, carregando, recarregar } = useSolicitacao(id);
  return (
    <>
      <PageHeader
        titulo={`Pedido nº ${id}`}
        acoes={
          <LinkButton href="/entidade/solicitacoes" variante="fantasma" icone={<ArrowLeft size={18} />}>
            Voltar
          </LinkButton>
        }
      />
      <Carregavel carregando={carregando} erro={erro} data={data} recarregar={recarregar}>
        {(s) => <Conteudo s={s} recarregar={recarregar} />}
      </Carregavel>
    </>
  );
}
