"use client";

import { useEffect } from "react";
import { Hourglass } from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Alerta, PageHeader } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";
import { SolicitacaoFormulario } from "./SolicitacaoFormulario";
import { useSalvarSolicitacao } from "../hooks/useSolicitacoes";

export function NovaSolicitacao() {
  const { usuario, atualizar } = useAuth();
  const salvar = useSalvarSolicitacao();

  // A aprovação pode ter acontecido depois do login: confere de novo.
  useEffect(() => {
    atualizar().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aprovada = usuario?.entidadeAprovada !== false;

  return (
    <>
      <PageHeader titulo="Pedir alimentos" subtitulo="Escolha o que sua entidade precisa." />
      {!aprovada ? (
        <div className="space-y-4">
          <Alerta tom="aviso" titulo="Seu cadastro está aguardando aprovação">
            <span className="flex items-start gap-2">
              <Hourglass className="mt-1 shrink-0" size={18} />
              Você poderá pedir alimentos assim que a equipe aprovar sua entidade. Enquanto isso,
              veja o que está disponível.
            </span>
          </Alerta>
          <LinkButton href="/entidade/estoque" variante="secundario">
            Ver alimentos disponíveis
          </LinkButton>
        </div>
      ) : (
        <SolicitacaoFormulario rotulo="Enviar pedido" onSubmit={salvar} />
      )}
    </>
  );
}
