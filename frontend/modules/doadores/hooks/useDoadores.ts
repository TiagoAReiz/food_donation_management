"use client";

import { useFetch } from "@/shared/hooks/useFetch";
import { useToast } from "@/shared/hooks/useToast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useAcao } from "@/shared/hooks/useEnvio";
import type { DoadorRequest } from "@/shared/types";
import { doadorService } from "../services/doadorService";

export function useDoadores() {
  const busca = useFetch("doadores", doadorService.listar);
  const toast = useToast();
  const { confirmar } = useConfirm();
  const { ocupado, executar } = useAcao();

  const salvar = async (id: number, dados: DoadorRequest) => {
    await doadorService.atualizar(id, dados);
    toast.sucesso("Doador atualizado!");
    busca.recarregar();
  };

  const excluir = async (id: number, nome: string) => {
    const ok = await confirmar({
      titulo: `Excluir ${nome}?`,
      texto: "Se o doador já fez doações, o cadastro será apenas desativado.",
      rotulo: "Sim, excluir",
      perigo: true,
    });
    if (!ok) return;
    const r = await executar(() => doadorService.excluir(id));
    if (r) {
      toast.sucesso(r.mensagem);
      busca.recarregar();
    }
  };

  return { ...busca, salvar, excluir, ocupado };
}
