"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Modal } from "@/shared/components/ui/Modal";
import { TIPOS_PESSOA } from "@/shared/utils/labels";
import type { DoadorResponse } from "@/shared/types";
import { DoadorForm } from "./DoadorForm";
import { useDoadores } from "../hooks/useDoadores";

export function AdminDoadores() {
  const { data, erro, carregando, recarregar, salvar, excluir, ocupado } = useDoadores();
  const [editando, setEditando] = useState<DoadorResponse | null>(null);

  return (
    <>
      <PageHeader titulo="Doadores" subtitulo="Pessoas e empresas que doam alimentos." />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={<EmptyState titulo="Nenhum doador cadastrado" />}
      >
        {(lista) => (
          <ul className="grid gap-3 md:grid-cols-2">
            {lista.map((d) => (
              <li key={d.id}>
                <Card className="h-full">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-lg font-extrabold">{d.nome}</p>
                    <Badge tom="cinza">{TIPOS_PESSOA[d.tipoPessoa].split(" (")[0]}</Badge>
                  </div>
                  <p className="break-all text-base text-ink-soft">{d.email}</p>
                  <p className="text-base text-ink-soft">
                    {d.documento}
                    {d.telefone && ` · ${d.telefone}`}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button variante="secundario" onClick={() => setEditando(d)} icone={<Pencil size={18} />}>
                      Editar
                    </Button>
                    <Button variante="fantasma" className="!text-red-700" disabled={ocupado} onClick={() => excluir(d.id, d.nome)} icone={<Trash2 size={18} />}>
                      Excluir
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Carregavel>

      <Modal aberto={!!editando} titulo="Editar doador" largo onFechar={() => setEditando(null)}>
        {editando && (
          <DoadorForm
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
