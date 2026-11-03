"use client";

import Link from "next/link";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";
import { SituacaoDoacaoBadge, ValidadeBadge } from "@/shared/components/ui/Badge";
import { CATEGORIAS } from "@/shared/utils/labels";
import { formatarData, formatarQtd } from "@/shared/utils/format";
import { useMeusAlimentos } from "../hooks/useDoacoes";

export function MeusAlimentos() {
  const { data, erro, carregando, recarregar } = useMeusAlimentos();
  return (
    <>
      <PageHeader
        titulo="Meus alimentos"
        subtitulo="Tudo o que você doou e quanto ainda não foi entregue a uma entidade."
      />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={
          <EmptyState
            titulo="Nenhum alimento por aqui ainda"
            texto="Quando você fizer uma doação, os alimentos aparecem nesta lista."
            acao={<LinkButton href="/doador/doacoes/nova" variante="laranja">Fazer uma doação</LinkButton>}
          />
        }
      >
        {(lista) => (
          <ul className="grid gap-3 md:grid-cols-2">
            {lista.map((a) => (
              <li key={a.id}>
                <Card className="h-full">
                  <p className="text-lg font-extrabold">{a.nome}</p>
                  <p className="text-base text-ink-soft">{CATEGORIAS[a.categoria]}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-base">
                    <div>
                      <dt className="text-sm text-ink-soft">Doado</dt>
                      <dd className="font-bold">{formatarQtd(a.quantidade, a.unidade)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-ink-soft">Ainda disponível</dt>
                      <dd className="font-bold">{formatarQtd(a.qtdDisponivel, a.unidade)}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SituacaoDoacaoBadge valor={a.situacaoDoacao} />
                    <ValidadeBadge validade={a.validade} />
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">
                    Doação de {formatarData(a.dataDoacao)} ·{" "}
                    <Link href={`/doador/doacoes/${a.doacaoId}`} className="font-bold text-brand-700 underline">
                      ver doação
                    </Link>
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Carregavel>
    </>
  );
}
