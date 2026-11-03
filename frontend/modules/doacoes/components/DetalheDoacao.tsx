"use client";

import { ArrowLeft, Pencil, XCircle } from "lucide-react";
import { Carregavel } from "@/shared/components/ui/Estados";
import { Alerta, Card, PageHeader } from "@/shared/components/ui/Card";
import { Button, LinkButton } from "@/shared/components/ui/Button";
import { SituacaoDoacaoBadge } from "@/shared/components/ui/Badge";
import { formatarData, formatarDataHora } from "@/shared/utils/format";
import type { DoacaoResponse } from "@/shared/types";
import { AlimentosDaDoacao } from "./AlimentosDaDoacao";
import { useCancelarDoacao, useDoacao } from "../hooks/useDoacoes";

function Conteudo({ d, recarregar }: { d: DoacaoResponse; recarregar: () => void }) {
  const { cancelar, ocupado } = useCancelarDoacao(d.id, recarregar);
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <SituacaoDoacaoBadge valor={d.situacao} />
          <span className="text-base text-ink-soft">Feita em {formatarData(d.dataDoacao)}</span>
        </div>
        {d.recebidaEm && d.situacao === "RECEBIDA" && (
          <p className="mt-2 text-base text-ink-soft">
            Recebida em {formatarDataHora(d.recebidaEm)}
          </p>
        )}
        {d.situacao === "PENDENTE" && (
          <p className="mt-2 text-base text-ink-soft">
            Nossa equipe vai conferir os alimentos quando eles chegarem.
          </p>
        )}
      </Card>

      {d.situacao === "RECUSADA" && d.observacao && (
        <Alerta tom="erro" titulo="Motivo da recusa">
          {d.observacao}
        </Alerta>
      )}
      {d.situacao !== "RECUSADA" && d.observacao && (
        <Card>
          <p className="text-sm font-bold text-ink-soft">Seu recado</p>
          <p className="text-base">{d.observacao}</p>
        </Card>
      )}

      <Card>
        <h2 className="mb-1 text-lg font-extrabold">Alimentos desta doação</h2>
        <AlimentosDaDoacao alimentos={d.alimentos} mostrarDisponivel={d.situacao === "RECEBIDA"} />
      </Card>

      {d.situacao === "PENDENTE" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href={`/doador/doacoes/${d.id}/editar`} icone={<Pencil size={18} />}>
            Editar doação
          </LinkButton>
          <Button variante="perigo" carregando={ocupado} onClick={cancelar} icone={<XCircle size={18} />}>
            Cancelar doação
          </Button>
        </div>
      )}
    </div>
  );
}

export function DetalheDoacao({ id }: { id: number }) {
  const { data, erro, carregando, recarregar } = useDoacao(id);
  return (
    <>
      <PageHeader
        titulo={`Doação nº ${id}`}
        acoes={
          <LinkButton href="/doador/doacoes" variante="fantasma" icone={<ArrowLeft size={18} />}>
            Voltar
          </LinkButton>
        }
      />
      <Carregavel carregando={carregando} erro={erro} data={data} recarregar={recarregar}>
        {(d) => <Conteudo d={d} recarregar={recarregar} />}
      </Carregavel>
    </>
  );
}
