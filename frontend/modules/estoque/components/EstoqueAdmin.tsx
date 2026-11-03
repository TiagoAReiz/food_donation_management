"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Abas } from "@/shared/components/ui/Abas";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Field";
import { Modal } from "@/shared/components/ui/Modal";
import { ValidadeBadge } from "@/shared/components/ui/Badge";
import { CATEGORIAS } from "@/shared/utils/labels";
import { diasAte, formatarQtd, lerNumero, siglaUnidade } from "@/shared/utils/format";
import type { EstoqueItemResponse } from "@/shared/types";
import { useAcoesEstoque, useEstoque, useEstoqueVencido } from "../hooks/useEstoque";

type Aba = "DISPONIVEL" | "VENCIDOS";

function ListaLotes({
  itens,
  recarregar,
  vencidos,
}: {
  itens: EstoqueItemResponse[];
  recarregar: () => void;
  vencidos: boolean;
}) {
  const { corrigir, retirar, ocupado } = useAcoesEstoque(recarregar);
  const [editando, setEditando] = useState<EstoqueItemResponse | null>(null);
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState("");

  function abrir(i: EstoqueItemResponse) {
    setEditando(i);
    setValor(String(i.qtdEmEstoque).replace(".", ","));
    setErro("");
  }

  async function salvar() {
    const n = lerNumero(valor);
    if (valor.trim() === "" || Number.isNaN(n) || n < 0) {
      setErro("Informe um número igual ou maior que zero.");
      return;
    }
    if (editando && (await corrigir(editando.id, n))) setEditando(null);
  }

  return (
    <>
      <ul className="grid gap-3 md:grid-cols-2">
        {itens.map((i) => (
          <li key={i.id}>
            <Card
              className="h-full"
              destaque={vencidos || diasAte(i.validade) < 0 ? "perigo" : diasAte(i.validade) <= 7 ? "alerta" : undefined}
            >
              <p className="text-lg font-extrabold">{i.nome}</p>
              <p className="text-base text-ink-soft">
                {CATEGORIAS[i.categoria]} · doação nº {i.doacaoId}
              </p>
              <p className="mt-2 text-xl font-extrabold text-brand-800">
                {formatarQtd(i.qtdEmEstoque, i.unidade)}
              </p>
              {i.qtdReservada > 0 && (
                <p className="text-base text-ink-soft">
                  <strong className="text-blue-800">{formatarQtd(i.qtdReservada, i.unidade)} reservado</strong> para
                  pedidos aprovados · {formatarQtd(i.qtdDisponivel, i.unidade)} livre
                </p>
              )}
              <div className="mt-2">
                <ValidadeBadge validade={i.validade} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variante="secundario" onClick={() => abrir(i)} icone={<Pencil size={18} />}>
                  Corrigir quantidade
                </Button>
                <Button
                  variante={vencidos ? "perigo" : "fantasma"}
                  disabled={ocupado}
                  onClick={() => retirar(i.id, i.nome)}
                  icone={<Trash2 size={18} />}
                >
                  Retirar do estoque
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Modal
        aberto={!!editando}
        titulo="Corrigir quantidade"
        onFechar={() => setEditando(null)}
        rodape={
          <>
            <Button variante="fantasma" onClick={() => setEditando(null)}>
              Voltar
            </Button>
            <Button carregando={ocupado} onClick={salvar}>
              Salvar
            </Button>
          </>
        }
      >
        {editando && (
          <>
            <p className="mb-3 text-base">
              {editando.nome}: informe quanto realmente existe agora, em{" "}
              {siglaUnidade(editando.unidade)}.
            </p>
            <Input
              label="Quantidade em estoque"
              inputMode="decimal"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value);
                setErro("");
              }}
              erro={erro}
              dica={
                editando.qtdReservada > 0
                  ? `Não pode ser maior que a quantidade doada nem menor que os ${formatarQtd(editando.qtdReservada, editando.unidade)} reservados.`
                  : "Não pode ser maior que a quantidade doada."
              }
            />
          </>
        )}
      </Modal>
    </>
  );
}

function Disponiveis() {
  const { data, erro, carregando, recarregar } = useEstoque();
  return (
    <Carregavel
      carregando={carregando}
      erro={erro}
      data={data}
      recarregar={recarregar}
      vazio={<EmptyState titulo="Estoque vazio" texto="Os alimentos aparecem aqui depois que as doações são confirmadas." />}
    >
      {(l) => <ListaLotes itens={l} recarregar={recarregar} vencidos={false} />}
    </Carregavel>
  );
}

function Vencidos() {
  const { data, erro, carregando, recarregar } = useEstoqueVencido();
  return (
    <Carregavel
      carregando={carregando}
      erro={erro}
      data={data}
      recarregar={recarregar}
      vazio={<EmptyState titulo="Nenhum lote vencido" texto="Tudo certo por aqui." />}
    >
      {(l) => <ListaLotes itens={l} recarregar={recarregar} vencidos />}
    </Carregavel>
  );
}

export function EstoqueAdmin() {
  const [aba, setAba] = useState<Aba>("DISPONIVEL");
  return (
    <>
      <PageHeader titulo="Estoque" subtitulo="Os alimentos que vencem primeiro aparecem no topo." />
      <Abas
        rotulo="Tipo de estoque"
        valor={aba}
        onChange={setAba}
        abas={[
          { valor: "DISPONIVEL", texto: "Disponível" },
          { valor: "VENCIDOS", texto: "Vencidos" },
        ]}
      />
      {aba === "DISPONIVEL" ? <Disponiveis /> : <Vencidos />}
    </>
  );
}
