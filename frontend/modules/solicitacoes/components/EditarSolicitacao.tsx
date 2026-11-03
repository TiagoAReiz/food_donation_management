"use client";

import { Carregavel } from "@/shared/components/ui/Estados";
import { Alerta, PageHeader } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";
import { SolicitacaoFormulario } from "./SolicitacaoFormulario";
import { useSalvarSolicitacao, useSolicitacao } from "../hooks/useSolicitacoes";

export function EditarSolicitacao({ id }: { id: number }) {
  const { data, erro, carregando, recarregar } = useSolicitacao(id);
  const salvar = useSalvarSolicitacao(id);
  return (
    <>
      <PageHeader titulo="Editar pedido" />
      <Carregavel carregando={carregando} erro={erro} data={data} recarregar={recarregar}>
        {(s) =>
          s.situacao !== "PENDENTE" ? (
            <div className="space-y-4">
              <Alerta tom="aviso" titulo="Este pedido não pode mais ser alterado">
                Só é possível editar pedidos que ainda estão aguardando aprovação.
              </Alerta>
              <LinkButton href={`/entidade/solicitacoes/${id}`} variante="secundario">
                Voltar para o pedido
              </LinkButton>
            </div>
          ) : (
            <SolicitacaoFormulario inicial={s} rotulo="Salvar alterações" onSubmit={salvar} />
          )
        }
      </Carregavel>
    </>
  );
}
