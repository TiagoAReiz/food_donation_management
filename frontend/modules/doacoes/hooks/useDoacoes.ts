"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { useToast } from "@/shared/hooks/useToast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useAcao } from "@/shared/hooks/useEnvio";
import type { DoacaoRequest, SituacaoDoacao } from "@/shared/types";
import { doacaoService } from "../services/doacaoService";

export function useMinhasDoacoes() {
  return useFetch("doacoes-minhas", doacaoService.minhas);
}

export function useMeusAlimentos() {
  return useFetch("meus-alimentos", doacaoService.meusAlimentos);
}

export function useDoacao(id: number) {
  return useFetch(`doacao-${id}`, () => doacaoService.buscar(id));
}

export function useDoacoesAdmin(situacao?: SituacaoDoacao) {
  return useFetch(`doacoes-admin-${situacao ?? "todas"}`, () => doacaoService.listar(situacao));
}

/** Criar e editar doação (do doador). */
export function useSalvarDoacao(id?: number) {
  const router = useRouter();
  const toast = useToast();
  return useCallback(
    async (dados: DoacaoRequest) => {
      const r = id ? await doacaoService.atualizar(id, dados) : await doacaoService.criar(dados);
      toast.sucesso(
        id
          ? "Doação atualizada!"
          : "Doação enviada! Agora é só levar os alimentos até nós para conferência.",
      );
      router.replace(`/doador/doacoes/${r.id}`);
    },
    [id, router, toast],
  );
}

export function useCancelarDoacao(id: number, aoConcluir: () => void) {
  const { confirmar } = useConfirm();
  const { ocupado, executar } = useAcao();
  const cancelar = async () => {
    const ok = await confirmar({
      titulo: "Cancelar esta doação?",
      texto: "Os alimentos desta doação não serão mais considerados. Essa ação não pode ser desfeita.",
      rotulo: "Sim, cancelar doação",
      perigo: true,
    });
    if (!ok) return;
    const r = await executar(() => doacaoService.cancelar(id), "Doação cancelada.");
    if (r) aoConcluir();
  };
  return { cancelar, ocupado };
}

/** Ações do administrador sobre uma doação. */
export function useConferirDoacao(id: number, aoConcluir: () => void) {
  const { confirmar, pedirMotivo } = useConfirm();
  const { ocupado, executar } = useAcao();

  const confirmarDoacao = async (alimentos: { id: number; quantidade: number }[]) => {
    const ok = await confirmar({
      titulo: "Confirmar o recebimento?",
      texto: "Os alimentos entram no estoque com as quantidades informadas.",
      rotulo: "Sim, confirmar",
    });
    if (!ok) return;
    const r = await executar(
      () => doacaoService.confirmar(id, alimentos),
      "Doação confirmada e alimentos no estoque!",
    );
    if (r) aoConcluir();
  };

  const recusarDoacao = async () => {
    const motivo = await pedirMotivo({
      titulo: "Recusar esta doação",
      texto: "Conte ao doador por que a doação não foi aceita.",
      rotulo: "Recusar doação",
    });
    if (!motivo) return;
    const r = await executar(() => doacaoService.recusar(id, motivo), "Doação recusada.");
    if (r) aoConcluir();
  };

  return { confirmarDoacao, recusarDoacao, ocupado };
}
