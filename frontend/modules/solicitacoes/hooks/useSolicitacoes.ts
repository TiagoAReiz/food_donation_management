"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { useToast } from "@/shared/hooks/useToast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useAcao } from "@/shared/hooks/useEnvio";
import type { SituacaoSolicitacao, SolicitacaoRequest } from "@/shared/types";
import { solicitacaoService } from "../services/solicitacaoService";

export function useMinhasSolicitacoes() {
  return useFetch("solicitacoes-minhas", solicitacaoService.minhas);
}

export function useSolicitacao(id: number) {
  return useFetch(`solicitacao-${id}`, () => solicitacaoService.buscar(id));
}

export function useSolicitacoesAdmin(situacao?: SituacaoSolicitacao) {
  return useFetch(`solicitacoes-admin-${situacao ?? "todas"}`, () =>
    solicitacaoService.listar(situacao),
  );
}

export function useSalvarSolicitacao(id?: number) {
  const router = useRouter();
  const toast = useToast();
  return useCallback(
    async (dados: SolicitacaoRequest) => {
      const r = id
        ? await solicitacaoService.atualizar(id, dados)
        : await solicitacaoService.criar(dados);
      toast.sucesso(id ? "Pedido atualizado!" : "Pedido enviado! Agora é só aguardar a aprovação.");
      router.replace(`/entidade/solicitacoes/${r.id}`);
    },
    [id, router, toast],
  );
}

export function useCancelarSolicitacao(id: number, aoConcluir: () => void) {
  const { confirmar } = useConfirm();
  const { ocupado, executar } = useAcao();
  const cancelar = async () => {
    const ok = await confirmar({
      titulo: "Cancelar este pedido?",
      texto: "O pedido deixa de valer. Você poderá fazer um novo depois.",
      rotulo: "Sim, cancelar pedido",
      perigo: true,
    });
    if (!ok) return;
    const r = await executar(() => solicitacaoService.cancelar(id), "Pedido cancelado.");
    if (r) aoConcluir();
  };
  return { cancelar, ocupado };
}

/** Ações do administrador sobre um pedido. */
export function useAvaliarSolicitacao(aoConcluir: () => void) {
  const { confirmar, pedirMotivo } = useConfirm();
  const { ocupado, executar } = useAcao();

  const aprovar = async (id: number) => {
    const r = await executar(() => solicitacaoService.aprovar(id), "Pedido aprovado!");
    if (r) aoConcluir();
  };

  const recusar = async (id: number) => {
    const motivo = await pedirMotivo({
      titulo: "Recusar este pedido",
      texto: "Explique à entidade por que o pedido não pode ser atendido.",
      rotulo: "Recusar pedido",
    });
    if (!motivo) return;
    const r = await executar(() => solicitacaoService.recusar(id, motivo), "Pedido recusado.");
    if (r) aoConcluir();
  };

  const entregar = async (id: number) => {
    const ok = await confirmar({
      titulo: "Registrar a entrega?",
      texto: "Os alimentos serão retirados do estoque. Faça isso só quando a entrega for feita.",
      rotulo: "Sim, registrar entrega",
    });
    if (!ok) return;
    const r = await executar(() => solicitacaoService.entregar(id), "Entrega registrada!");
    if (r) aoConcluir();
  };

  return { aprovar, recusar, entregar, ocupado };
}
