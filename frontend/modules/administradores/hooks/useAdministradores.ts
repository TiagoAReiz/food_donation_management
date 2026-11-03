"use client";

import { useFetch } from "@/shared/hooks/useFetch";
import { useToast } from "@/shared/hooks/useToast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useAcao } from "@/shared/hooks/useEnvio";
import type { AdministradorRequest } from "@/shared/types";
import { administradorService } from "../services/administradorService";

export function useAdministradores() {
  const busca = useFetch("administradores", administradorService.listar);
  const toast = useToast();
  const { confirmar } = useConfirm();
  const { ocupado, executar } = useAcao();

  const salvar = async (id: number | null, dados: AdministradorRequest) => {
    if (id) await administradorService.atualizar(id, dados);
    else await administradorService.criar(dados);
    toast.sucesso(id ? "Administrador atualizado!" : "Administrador criado!");
    busca.recarregar();
  };

  const excluir = async (id: number, nome: string) => {
    const ok = await confirmar({
      titulo: `Excluir ${nome}?`,
      texto: "Se esta pessoa já avaliou doações ou pedidos, o acesso será apenas desativado.",
      rotulo: "Sim, excluir",
      perigo: true,
    });
    if (!ok) return;
    const r = await executar(() => administradorService.excluir(id));
    if (r) {
      toast.sucesso(r.mensagem);
      busca.recarregar();
    }
  };

  return { ...busca, salvar, excluir, ocupado };
}
