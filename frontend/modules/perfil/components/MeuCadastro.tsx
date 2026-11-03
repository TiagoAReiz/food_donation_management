"use client";

import { Trash2 } from "lucide-react";
import { Carregavel } from "@/shared/components/ui/Estados";
import { Alerta, Card, PageHeader } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { DoadorForm } from "@/modules/doadores/components/DoadorForm";
import { EntidadeForm } from "@/modules/entidades/components/EntidadeForm";
import { useMeuCadastroDoador, useMeuCadastroEntidade } from "../hooks/useMeuCadastro";

function ZonaExclusao({ onExcluir, ocupado }: { onExcluir: () => void; ocupado: boolean }) {
  return (
    <Card destaque="perigo" className="mt-6">
      <h2 className="text-lg font-extrabold text-red-900">Excluir minha conta</h2>
      <p className="mb-3 text-base text-red-900">
        Se você não quiser mais usar o sistema, pode excluir seu cadastro.
      </p>
      <Button variante="perigo" carregando={ocupado} onClick={onExcluir} icone={<Trash2 size={18} />}>
        Excluir minha conta
      </Button>
    </Card>
  );
}

export function MeuCadastroDoador() {
  const { data, erro, carregando, recarregar, salvar, excluirConta, excluindo } =
    useMeuCadastroDoador();
  return (
    <>
      <PageHeader titulo="Meu cadastro" subtitulo="Mantenha seus dados em dia." />
      <Carregavel carregando={carregando} erro={erro} data={data} recarregar={recarregar}>
        {(d) => (
          <>
            <Card>
              <DoadorForm inicial={d} modo="edicao" rotulo="Salvar alterações" onSubmit={salvar} />
            </Card>
            <ZonaExclusao onExcluir={excluirConta} ocupado={excluindo} />
          </>
        )}
      </Carregavel>
    </>
  );
}

export function MeuCadastroEntidade() {
  const { data, erro, carregando, recarregar, salvar, excluirConta, excluindo } =
    useMeuCadastroEntidade();
  return (
    <>
      <PageHeader titulo="Meu cadastro" subtitulo="Mantenha os dados da entidade em dia." />
      <Carregavel carregando={carregando} erro={erro} data={data} recarregar={recarregar}>
        {(d) => (
          <>
            {!d.aprovada && (
              <div className="mb-4">
                <Alerta tom="aviso" titulo="Aguardando aprovação">
                  Nossa equipe está conferindo os dados da entidade. Depois da aprovação você poderá
                  pedir alimentos.
                </Alerta>
              </div>
            )}
            <Card>
              <EntidadeForm inicial={d} modo="edicao" rotulo="Salvar alterações" onSubmit={salvar} />
            </Card>
            <ZonaExclusao onExcluir={excluirConta} ocupado={excluindo} />
          </>
        )}
      </Carregavel>
    </>
  );
}
