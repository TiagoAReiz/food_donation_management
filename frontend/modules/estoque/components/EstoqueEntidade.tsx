"use client";

import { Carregavel, EmptyState } from "@/shared/components/ui/Estados";
import { Card, PageHeader } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";
import { ValidadeBadge } from "@/shared/components/ui/Badge";
import { CATEGORIAS } from "@/shared/utils/labels";
import { diasAte, formatarQtd } from "@/shared/utils/format";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useEstoque } from "../hooks/useEstoque";

export function EstoqueEntidade() {
  const { usuario } = useAuth();
  const { data, erro, carregando, recarregar } = useEstoque();
  const aprovada = usuario?.entidadeAprovada !== false;

  return (
    <>
      <PageHeader
        titulo="Alimentos disponíveis"
        subtitulo="Os que vencem primeiro aparecem no topo."
        acoes={
          aprovada ? (
            <LinkButton href="/entidade/solicitacoes/nova" variante="laranja">
              Pedir alimentos
            </LinkButton>
          ) : undefined
        }
      />
      <Carregavel
        carregando={carregando}
        erro={erro}
        data={data}
        recarregar={recarregar}
        vazio={
          <EmptyState
            titulo="Nenhum alimento disponível agora"
            texto="Quando chegarem novas doações, elas aparecem aqui."
          />
        }
      >
        {(lista) => (
          <ul className="grid gap-3 md:grid-cols-2">
            {lista.map((i) => (
              <li key={i.id}>
                <Card className="h-full" destaque={diasAte(i.validade) <= 7 ? "alerta" : undefined}>
                  <p className="text-lg font-extrabold">{i.nome}</p>
                  <p className="text-base text-ink-soft">{CATEGORIAS[i.categoria]}</p>
                  <p className="mt-2 text-xl font-extrabold text-brand-800">
                    {formatarQtd(i.qtdDisponivel, i.unidade)}
                  </p>
                  <div className="mt-2">
                    <ValidadeBadge validade={i.validade} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Carregavel>
    </>
  );
}
