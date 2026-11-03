"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";
import { SituacaoDoacaoBadge } from "@/shared/components/ui/Badge";
import { formatarData } from "@/shared/utils/format";
import { useMinhasDoacoes } from "../hooks/useDoacoes";

export function MinhasDoacoes() {
  const { data, erro, carregando, recarregar } = useMinhasDoacoes();
  const nova = (
    <LinkButton href="/doador/doacoes/nova" variante="laranja" icone={<Plus size={20} />}>
      Nova doação
    </LinkButton>
  );

  return (
    <>
      <PageHeader titulo="Minhas doações" subtitulo="Acompanhe tudo o que você já doou." acoes={nova} />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={
          <EmptyState
            titulo="Você ainda não fez nenhuma doação"
            texto="Que tal começar agora? Leva só alguns minutos."
            acao={nova}
          />
        }
      >
        {(lista) => (
          <ul className="space-y-3">
            {lista.map((d) => (
              <li key={d.id}>
                <Link href={`/doador/doacoes/${d.id}`}>
                  <Card className="transition-colors hover:border-brand-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-extrabold text-ink">
                          Doação de {formatarData(d.dataDoacao)}
                        </p>
                        <p className="mt-0.5 truncate text-base text-ink-soft">
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
