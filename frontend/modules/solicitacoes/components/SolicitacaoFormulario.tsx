"use client";

import { useState, type FormEvent } from "react";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Alerta, Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Field";
import { ValidadeBadge } from "@/shared/components/ui/Badge";
import { useEnvio } from "@/shared/hooks/useEnvio";
import { CATEGORIAS } from "@/shared/utils/labels";
import { formatarNumero, formatarQtd, lerNumero, siglaUnidade } from "@/shared/utils/format";
import { useEstoque } from "@/modules/estoque/hooks/useEstoque";
import type { SolicitacaoRequest, SolicitacaoResponse } from "@/shared/types";

interface Props {
  inicial?: SolicitacaoResponse;
  rotulo: string;
  onSubmit: (dados: SolicitacaoRequest) => Promise<unknown>;
}

export function SolicitacaoFormulario({ inicial, rotulo, onSubmit }: Props) {
  const estoque = useEstoque();
  const { enviando, erroGeral, executar } = useEnvio();
  const [qtds, setQtds] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      (inicial?.itens ?? []).map((i) => [i.alimentoId, String(i.quantidade).replace(".", ",")]),
    ),
  );
  const [erros, setErros] = useState<Record<number, string>>({});
  const [vazio, setVazio] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const lista = estoque.data ?? [];
    const erro: Record<number, string> = {};
    const itens: { alimentoId: number; quantidade: number }[] = [];
    for (const i of lista) {
      const txt = qtds[i.id]?.trim();
      if (!txt) continue;
      const q = lerNumero(txt);
      if (Number.isNaN(q) || q < 0) erro[i.id] = "Informe um número válido.";
      else if (q > i.qtdDisponivel)
        erro[i.id] = `Só há ${formatarQtd(i.qtdDisponivel, i.unidade)} disponível.`;
      else if (q > 0) itens.push({ alimentoId: i.id, quantidade: q });
    }
    setErros(erro);
    setVazio(false);
    if (Object.keys(erro).length) return;
    if (itens.length === 0) {
      setVazio(true);
      return;
    }
    await executar(() => onSubmit({ itens }));
  }

  return (
    <Carregavel
      carregando={estoque.carregando}
      erro={estoque.erro}
      data={estoque.data}
      recarregar={estoque.recarregar}
      vazio={
        <EmptyState
          titulo="Nenhum alimento disponível agora"
          texto="Volte mais tarde: novas doações chegam com frequência."
        />
      }
    >
      {(lista) => (
        <form onSubmit={enviar} noValidate className="space-y-4">
          <p className="text-base text-ink-soft">
            Digite quanto você quer de cada alimento. Deixe em branco o que não precisa.
          </p>
          <ul className="space-y-3">
            {lista.map((i) => (
              <li key={i.id}>
                <Card>
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-extrabold">{i.nome}</p>
                      <p className="text-base text-ink-soft">
                        {CATEGORIAS[i.categoria]} · disponível:{" "}
                        <strong>{formatarQtd(i.qtdDisponivel, i.unidade)}</strong>
                      </p>
                    </div>
                    <ValidadeBadge validade={i.validade} />
                  </div>
                  <Input
                    label={`Quanto você quer? (${siglaUnidade(i.unidade)})`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={i.qtdDisponivel}
                    step="any"
                    placeholder={`Até ${formatarNumero(i.qtdDisponivel)}`}
                    value={qtds[i.id] ?? ""}
                    onChange={(e) => setQtds((q) => ({ ...q, [i.id]: e.target.value }))}
                    erro={erros[i.id]}
                  />
                </Card>
              </li>
            ))}
          </ul>
          {vazio && <Alerta tom="aviso">Escolha pelo menos um alimento para pedir.</Alerta>}
          {erroGeral && <Alerta tom="erro">{erroGeral}</Alerta>}
          <Button type="submit" larga carregando={enviando}>
            {rotulo}
          </Button>
        </form>
      )}
    </Carregavel>
  );
}
