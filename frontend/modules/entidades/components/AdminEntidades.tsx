"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Abas } from "@/shared/components/ui/Abas";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Modal } from "@/shared/components/ui/Modal";
import type { EntidadeResponse } from "@/shared/types";
import { EntidadeForm } from "./EntidadeForm";
import { useEntidades } from "../hooks/useEntidades";

type Aba = "PENDENTES" | "APROVADAS";

export function AdminEntidades() {
  const [aba, setAba] = useState<Aba>("PENDENTES");
  const { data, erro, carregando, recarregar, salvar, aprovar, recusar, excluir, ocupado } =
    useEntidades(aba === "APROVADAS");
  const [editando, setEditando] = useState<EntidadeResponse | null>(null);

  return (
    <>
      <PageHeader titulo="Entidades" subtitulo="Creches, abrigos e outras entidades que recebem alimentos." />
      <Abas
        rotulo="Situação das entidades"
        valor={aba}
        onChange={setAba}
        abas={[
          { valor: "PENDENTES", texto: "Para aprovar" },
          { valor: "APROVADAS", texto: "Aprovadas" },
        ]}
      />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={
          <EmptyState
            titulo={aba === "PENDENTES" ? "Nenhuma entidade para aprovar" : "Nenhuma entidade aprovada"}
          />
        }
      >
        {(lista) => (
          <ul className="grid gap-3 md:grid-cols-2">
            {lista.map((e) => (
              <li key={e.id}>
                <Card className="h-full">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-lg font-extrabold">{e.nome}</p>
                    <Badge tom={e.aprovada ? "azul" : "amarelo"}>
                      {e.aprovada ? "Aprovada" : "Aguardando aprovação"}
                    </Badge>
                  </div>
                  <p className="text-base text-ink-soft">CNPJ {e.cnpj}</p>
                  <p className="text-base text-ink-soft">
                    Responsável: {e.responsavel} · atende {e.pessoasAtendidas} pessoas
                  </p>
                  <p className="text-base text-ink-soft">{e.endereco}</p>
                  <p className="break-all text-base text-ink-soft">
                    {e.email}
                    {e.telefone && ` · ${e.telefone}`}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {!e.aprovada && (
                      <>
                        <Button disabled={ocupado} onClick={() => aprovar(e.id)} icone={<Check size={20} />}>
                          Aprovar
                        </Button>
                        <Button variante="perigo" disabled={ocupado} onClick={() => recusar(e.id, e.nome)} icone={<X size={20} />}>
                          Recusar
                        </Button>
                      </>
                    )}
                    <Button variante="secundario" onClick={() => setEditando(e)} icone={<Pencil size={18} />}>
                      Editar
                    </Button>
                    {e.aprovada && (
                      <Button variante="fantasma" className="!text-red-700" disabled={ocupado} onClick={() => excluir(e.id, e.nome)} icone={<Trash2 size={18} />}>
                        Excluir
                      </Button>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Carregavel>

      <Modal aberto={!!editando} titulo="Editar entidade" largo onFechar={() => setEditando(null)}>
        {editando && (
          <EntidadeForm
            inicial={editando}
            modo="edicao"
            rotulo="Salvar alterações"
            onSubmit={async (dados) => {
              await salvar(editando.id, dados);
              setEditando(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}
