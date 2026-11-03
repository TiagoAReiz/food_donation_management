"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Select, Textarea } from "@/shared/components/ui/Field";
import { Alerta, Card } from "@/shared/components/ui/Card";
import { useEnvio } from "@/shared/hooks/useEnvio";
import { CATEGORIAS, UNIDADES } from "@/shared/utils/labels";
import { hojeIso, lerNumero } from "@/shared/utils/format";
import type {
  Categoria,
  DoacaoRequest,
  DoacaoResponse,
  Unidade,
} from "@/shared/types";

interface Linha {
  chave: number;
  nome: string;
  categoria: Categoria;
  quantidade: string;
  unidade: Unidade;
  validade: string;
}

let seq = 0;
const nova = (): Linha => ({
  chave: ++seq,
  nome: "",
  categoria: "GRAOS",
  quantidade: "",
  unidade: "KG",
  validade: "",
});

interface Props {
  inicial?: DoacaoResponse;
  rotulo: string;
  onSubmit: (dados: DoacaoRequest) => Promise<unknown>;
}

export function DoacaoFormulario({ inicial, rotulo, onSubmit }: Props) {
  const { enviando, campos, erroGeral, executar } = useEnvio();
  const [observacao, setObservacao] = useState(inicial?.observacao ?? "");
  const [linhas, setLinhas] = useState<Linha[]>(() =>
    inicial?.alimentos.length
      ? inicial.alimentos.map((a) => ({
          chave: ++seq,
          nome: a.nome,
          categoria: a.categoria,
          quantidade: String(a.quantidade).replace(".", ","),
          unidade: a.unidade,
          validade: a.validade,
        }))
      : [nova()],
  );
  const [locais, setLocais] = useState<Record<string, string>>({});

  const erro = (i: number, c: string) => locais[`${i}.${c}`] ?? campos[`alimentos[${i}].${c}`];

  function mudar(chave: number, parte: Partial<Linha>) {
    setLinhas((l) => l.map((x) => (x.chave === chave ? { ...x, ...parte } : x)));
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const l: Record<string, string> = {};
    const hoje = hojeIso();
    linhas.forEach((x, i) => {
      if (!x.nome.trim()) l[`${i}.nome`] = "Diga qual é o alimento.";
      const q = lerNumero(x.quantidade);
      if (!x.quantidade.trim() || !(q > 0)) l[`${i}.quantidade`] = "Informe uma quantidade maior que zero.";
      if (!x.validade) l[`${i}.validade`] = "Informe a data de validade.";
      else if (x.validade < hoje) l[`${i}.validade`] = "Este alimento já está vencido e não pode ser doado.";
    });
    setLocais(l);
    if (Object.keys(l).length) return;

    await executar(() =>
      onSubmit({
        observacao: observacao.trim() || undefined,
        alimentos: linhas.map((x) => ({
          nome: x.nome.trim(),
          categoria: x.categoria,
          quantidade: lerNumero(x.quantidade),
          unidade: x.unidade,
          validade: x.validade,
        })),
      }),
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      {linhas.map((x, i) => (
        <Card key={x.chave}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-brand-800">Alimento {i + 1}</h2>
            {linhas.length > 1 && (
              <Button
                variante="fantasma"
                className="!text-red-700"
                onClick={() => setLinhas((l) => l.filter((y) => y.chave !== x.chave))}
                icone={<Trash2 size={18} />}
                aria-label={`Remover alimento ${i + 1}`}
              >
                Remover
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="O que é? (ex.: Arroz, Leite)"
                value={x.nome}
                onChange={(e) => mudar(x.chave, { nome: e.target.value })}
                erro={erro(i, "nome")}
              />
            </div>
            <Select
              label="Tipo de alimento"
              value={x.categoria}
              onChange={(e) => mudar(x.chave, { categoria: e.target.value as Categoria })}
              erro={erro(i, "categoria")}
            >
              {Object.entries(CATEGORIAS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
            <Input
              label="Validade"
              type="date"
              min={hojeIso()}
              value={x.validade}
              onChange={(e) => mudar(x.chave, { validade: e.target.value })}
              erro={erro(i, "validade")}
            />
            <Input
              label="Quantidade"
              inputMode="decimal"
              placeholder="Ex.: 10"
              value={x.quantidade}
              onChange={(e) => mudar(x.chave, { quantidade: e.target.value })}
              erro={erro(i, "quantidade")}
            />
            <Select
              label="Medida"
              value={x.unidade}
              onChange={(e) => mudar(x.chave, { unidade: e.target.value as Unidade })}
              erro={erro(i, "unidade")}
            >
              {Object.entries(UNIDADES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </div>
        </Card>
      ))}

      <Button variante="secundario" larga icone={<Plus size={20} />} onClick={() => setLinhas((l) => [...l, nova()])}>
        Adicionar outro alimento
      </Button>

      <Textarea
        label="Quer deixar um recado? (opcional)"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        erro={campos.observacao}
      />

      {campos.alimentos && <Alerta tom="erro">{campos.alimentos}</Alerta>}
      {erroGeral && <Alerta tom="erro">{erroGeral}</Alerta>}
      <Button type="submit" larga carregando={enviando}>
        {rotulo}
      </Button>
    </form>
  );
}
