"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";
import { SituacaoSolicitacaoBadge } from "@/shared/components/ui/Badge";
import { formatarData } from "@/shared/utils/format";
import { useMinhasSolicitacoes } from "../hooks/useSolicitacoes";

export function MinhasSolicitacoes() {
  const { data, erro, carregando, recarregar } = useMinhasSolicitacoes();
  const novo = (
    <LinkButton href="/entidade/solicitacoes/nova" variante="laranja" icone={<Plus size={20} />}>
      Pedir alimentos
    </LinkButton>
  );
  return (
    <>
      <PageHeader titulo="Meus pedidos" subtitulo="Acompanhe os pedidos da sua entidade." acoes={novo} />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={
          <EmptyState
            titulo="Nenhum pedido ainda"
            texto="Escolha os alimentos que sua entidade precisa."
            acao={novo}
          />
        }
      >
        {(lista) => (
          <ul className="space-y-3">
            {lista.map((s) => (
              <li key={s.id}>
                <Link href={`/entidade/solicitacoes/${s.id}`}>
                  <Card className="transition-colors hover:border-brand-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-extrabold">Pedido de {formatarData(s.dataSolicitacao)}</p>
                        <p className="truncate text-base text-ink-soft">
                          {s.itens.map((i) => i.nome).join(", ")}
                        </p>
                      </div>
                      <ChevronRight className="mt-1 shrink-0 text-stone-400" />
                    </div>
                    <div className="mt-3">
                      <SituacaoSolicitacaoBadge valor={s.situacao} />
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
