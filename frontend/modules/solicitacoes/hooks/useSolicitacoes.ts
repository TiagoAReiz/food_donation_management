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
    const ok = await confirmar({
      titulo: "Aprovar este pedido?",
      texto: "Os alimentos ficam reservados para esta entidade e deixam de aparecer para outros pedidos.",
      rotulo: "Sim, aprovar",
    });
    if (!ok) return;
    const r = await executar(() => solicitacaoService.aprovar(id), "Pedido aprovado e alimentos reservados!");
    if (r) aoConcluir();
  };

  const recusar = async (id: number, aprovado = false) => {
    const motivo = await pedirMotivo({
      titulo: aprovado ? "Cancelar este pedido aprovado" : "Recusar este pedido",
      texto: aprovado
        ? "A reserva será desfeita e os alimentos voltam a ficar livres. Explique à entidade o motivo."
        : "Explique à entidade por que o pedido não pode ser atendido.",
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
