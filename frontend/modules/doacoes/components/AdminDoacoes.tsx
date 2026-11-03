"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Abas } from "@/shared/components/ui/Abas";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { SituacaoDoacaoBadge } from "@/shared/components/ui/Badge";
import { formatarData } from "@/shared/utils/format";
import type { SituacaoDoacao } from "@/shared/types";
import { useDoacoesAdmin } from "../hooks/useDoacoes";

type Filtro = SituacaoDoacao | "TODAS";

const ABAS: { valor: Filtro; texto: string }[] = [
  { valor: "PENDENTE", texto: "Para conferir" },
  { valor: "RECEBIDA", texto: "Recebidas" },
  { valor: "RECUSADA", texto: "Recusadas" },
  { valor: "CANCELADA", texto: "Canceladas" },
  { valor: "TODAS", texto: "Todas" },
];

export function AdminDoacoes() {
  const [filtro, setFiltro] = useState<Filtro>("PENDENTE");
  const { data, erro, carregando, recarregar } = useDoacoesAdmin(
    filtro === "TODAS" ? undefined : filtro,
  );

  return (
    <>
      <PageHeader titulo="Doações" subtitulo="Confira as doações que chegaram." />
      <Abas abas={ABAS} valor={filtro} onChange={setFiltro} rotulo="Filtrar doações" />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={
          <EmptyState
            titulo={filtro === "PENDENTE" ? "Nenhuma doação para conferir" : "Nenhuma doação aqui"}
            texto={filtro === "PENDENTE" ? "Tudo em dia! Novas doações aparecem aqui." : undefined}
          />
        }
      >
        {(lista) => (
          <ul className="space-y-3">
            {lista.map((d) => (
              <li key={d.id}>
                <Link href={`/admin/doacoes/${d.id}`}>
                  <Card className="transition-colors hover:border-brand-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-extrabold">{d.doador.nome}</p>
                        <p className="text-base text-ink-soft">
                          {formatarData(d.dataDoacao)} · {d.alimentos.length}{" "}
                          {d.alimentos.length === 1 ? "alimento" : "alimentos"}
                        </p>
                        <p className="truncate text-base text-ink-soft">
                          {d.alimentos.map((a) => a.nome).join(", ")}
                        </p>
                      </div>
                      <ChevronRight className="mt-1 shrink-0 text-stone-400" />
                    </div>
                    <div className="mt-3">
                      <SituacaoDoacaoBadge valor={d.situacao} />
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Carregavel>
    </>
  );
}
