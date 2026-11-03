"use client";

import { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Carregavel } from "@/shared/components/ui/Estados";
import { Alerta, Card, PageHeader } from "@/shared/components/ui/Card";
import { Button, LinkButton } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Field";
import { SituacaoDoacaoBadge, ValidadeBadge } from "@/shared/components/ui/Badge";
import { CATEGORIAS } from "@/shared/utils/labels";
import { formatarData, formatarDataHora, lerNumero, siglaUnidade } from "@/shared/utils/format";
import type { DoacaoResponse } from "@/shared/types";
import { AlimentosDaDoacao } from "./AlimentosDaDoacao";
import { useConferirDoacao, useDoacao } from "../hooks/useDoacoes";

function Conferencia({ d, recarregar }: { d: DoacaoResponse; recarregar: () => void }) {
  const { confirmarDoacao, recusarDoacao, ocupado } = useConferirDoacao(d.id, recarregar);
  const [qtds, setQtds] = useState<Record<number, string>>(() =>
    Object.fromEntries(d.alimentos.map((a) => [a.id, String(a.quantidade).replace(".", ",")])),
  );
  const [erros, setErros] = useState<Record<number, string>>({});

  function confirmar() {
    const e: Record<number, string> = {};
    d.alimentos.forEach((a) => {
      if (!(lerNumero(qtds[a.id]) > 0)) e[a.id] = "Informe uma quantidade maior que zero.";
    });
    setErros(e);
    if (Object.keys(e).length) return;
    void confirmarDoacao(d.alimentos.map((a) => ({ id: a.id, quantidade: lerNumero(qtds[a.id]) })));
  }

  return (
    <Card>
      <h2 className="text-lg font-extrabold">Confira os alimentos recebidos</h2>
      <p className="mb-3 text-base text-ink-soft">
        Se a quantidade que chegou for diferente da informada, corrija antes de confirmar.
      </p>
      <ul className="space-y-4">
        {d.alimentos.map((a) => (
          <li key={a.id} className="rounded-2xl bg-stone-50 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-lg font-extrabold">
                {a.nome} <span className="text-base font-semibold text-ink-soft">({CATEGORIAS[a.categoria]})</span>
              </p>
              <ValidadeBadge validade={a.validade} />
            </div>
            <Input
              label={`Quantidade recebida (informado: ${String(a.quantidade).replace(".", ",")} ${siglaUnidade(a.unidade)})`}
              inputMode="decimal"
              value={qtds[a.id]}
              onChange={(ev) => setQtds((q) => ({ ...q, [a.id]: ev.target.value }))}
              erro={erros[a.id]}
            />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button carregando={ocupado} onClick={confirmar} icone={<Check size={20} />}>
          Confirmar recebimento
        </Button>
        <Button variante="perigo" disabled={ocupado} onClick={recusarDoacao} icone={<X size={20} />}>
          Recusar doação
        </Button>
      </div>
    </Card>
  );
}

function Conteudo({ d, recarregar }: { d: DoacaoResponse; recarregar: () => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-lg font-extrabold">{d.doador.nome}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <SituacaoDoacaoBadge valor={d.situacao} />
          <span className="text-base text-ink-soft">Doação de {formatarData(d.dataDoacao)}</span>
        </div>
        {d.recebidaEm && (
          <p className="mt-2 text-base text-ink-soft">
            Avaliada em {formatarDataHora(d.recebidaEm)}
            {d.recebidaPor ? ` por ${d.recebidaPor.nome}` : ""}
          </p>
        )}
      </Card>
      {d.observacao && (
        <Alerta tom={d.situacao === "RECUSADA" ? "erro" : "info"} titulo={d.situacao === "RECUSADA" ? "Motivo da recusa" : "Recado do doador"}>
          {d.observacao}
        </Alerta>
      )}
      {d.situacao === "PENDENTE" ? (
        <Conferencia d={d} recarregar={recarregar} />
      ) : (
        <Card>
          <h2 className="text-lg font-extrabold">Alimentos</h2>
          <AlimentosDaDoacao alimentos={d.alimentos} mostrarDisponivel={d.situacao === "RECEBIDA"} />
        </Card>
      )}
    </div>
  );
}

export function ConferirDoacao({ id }: { id: number }) {
  const { data, erro, carregando, recarregar } = useDoacao(id);
  return (
    <>
      <PageHeader
        titulo={`Doação nº ${id}`}
        acoes={
          <LinkButton href="/admin/doacoes" variante="fantasma" icone={<ArrowLeft size={18} />}>
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
