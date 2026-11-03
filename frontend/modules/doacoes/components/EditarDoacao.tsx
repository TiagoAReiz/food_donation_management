"use client";

import { Carregavel } from "@/shared/components/ui/Estados";
import { Alerta, PageHeader } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";
import { DoacaoFormulario } from "./DoacaoFormulario";
import { useDoacao, useSalvarDoacao } from "../hooks/useDoacoes";

export function EditarDoacao({ id }: { id: number }) {
  const { data, erro, carregando, recarregar } = useDoacao(id);
  const salvar = useSalvarDoacao(id);

  return (
    <>
      <PageHeader titulo="Editar doação" />
      <Carregavel carregando={carregando} erro={erro} data={data} recarregar={recarregar}>
        {(d) =>
          d.situacao !== "PENDENTE" ? (
            <div className="space-y-4">
              <Alerta tom="aviso" titulo="Esta doação não pode mais ser alterada">
                Só é possível editar doações que ainda não foram conferidas.
              </Alerta>
              <LinkButton href={`/doador/doacoes/${id}`} variante="secundario">
                Voltar para a doação
              </LinkButton>
            </div>
          ) : (
            <DoacaoFormulario inicial={d} rotulo="Salvar alterações" onSubmit={salvar} />
          )
        }
      </Carregavel>
    </>
  );
}
