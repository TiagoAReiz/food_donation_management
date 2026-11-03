"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { UsuarioResponse } from "@/shared/types";
import { AdministradorForm } from "./AdministradorForm";
import { useAdministradores } from "../hooks/useAdministradores";

export function AdminAdministradores() {
  const { usuario } = useAuth();
  const { data, erro, carregando, recarregar, salvar, excluir, ocupado } = useAdministradores();
  // undefined = fechado, null = novo, objeto = editando
  const [alvo, setAlvo] = useState<UsuarioResponse | null | undefined>(undefined);

  return (
    <>
      <PageHeader
        titulo="Administradores"
        subtitulo="Quem pode conferir doações e pedidos."
        acoes={
          <Button variante="laranja" onClick={() => setAlvo(null)} icone={<Plus size={20} />}>
            Novo administrador
          </Button>
        }
      />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={<EmptyState titulo="Nenhum administrador" />}
      >
        {(lista) => (
          <ul className="grid gap-3 md:grid-cols-2">
            {lista.map((a) => (
              <li key={a.id}>
                <Card className="h-full">
                  <p className="text-lg font-extrabold">
                    {a.nome}
                    {a.id === usuario?.id && (
                      <span className="ml-2 text-sm font-bold text-brand-700">(você)</span>
                    )}
                  </p>
                  <p className="break-all text-base text-ink-soft">{a.email}</p>
                  {a.telefone && <p className="text-base text-ink-soft">{a.telefone}</p>}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button variante="secundario" onClick={() => setAlvo(a)} icone={<Pencil size={18} />}>
                      Editar
                    </Button>
                    {a.id !== usuario?.id && (
                      <Button variante="fantasma" className="!text-red-700" disabled={ocupado} onClick={() => excluir(a.id, a.nome)} icone={<Trash2 size={18} />}>
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

      <Modal
        aberto={alvo !== undefined}
        titulo={alvo ? "Editar administrador" : "Novo administrador"}
        onFechar={() => setAlvo(undefined)}
      >
        {alvo !== undefined && (
          <AdministradorForm
            inicial={alvo ?? undefined}
            rotulo={alvo ? "Salvar alterações" : "Criar administrador"}
            onSubmit={async (dados) => {
              await salvar(alvo?.id ?? null, dados);
              setAlvo(undefined);
            }}
          />
        )}
      </Modal>
    </>
  );
}
