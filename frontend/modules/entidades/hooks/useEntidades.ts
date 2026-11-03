"use client";

import { useFetch } from "@/shared/hooks/useFetch";
import { useToast } from "@/shared/hooks/useToast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useAcao } from "@/shared/hooks/useEnvio";
import type { EntidadeRequest } from "@/shared/types";
import { entidadeService } from "../services/entidadeService";

export function useEntidades(aprovada?: boolean) {
  const busca = useFetch(`entidades-${aprovada ?? "todas"}`, () =>
    entidadeService.listar(aprovada),
  );
  const toast = useToast();
  const { confirmar } = useConfirm();
  const { ocupado, executar } = useAcao();

  const salvar = async (id: number, dados: EntidadeRequest) => {
    await entidadeService.atualizar(id, dados);
    toast.sucesso("Entidade atualizada!");
    busca.recarregar();
  };

  const aprovar = async (id: number) => {
    const r = await executar(() => entidadeService.aprovar(id), "Entidade aprovada!");
    if (r) busca.recarregar();
  };

  const recusar = async (id: number, nome: string) => {
    const ok = await confirmar({
      titulo: `Recusar o cadastro de ${nome}?`,
      texto: "O cadastro será removido. A entidade poderá se cadastrar de novo se quiser.",
      rotulo: "Sim, recusar cadastro",
      perigo: true,
    });
    if (!ok) return;
    const r = await executar(() => entidadeService.recusar(id).then(() => true), "Cadastro recusado.");
    if (r) busca.recarregar();
  };

  const excluir = async (id: number, nome: string) => {
    const ok = await confirmar({
      titulo: `Excluir ${nome}?`,
      texto: "Se a entidade já fez pedidos, o cadastro será apenas desativado.",
      rotulo: "Sim, excluir",
      perigo: true,
    });
    if (!ok) return;
    const r = await executar(() => entidadeService.excluir(id));
    if (r) {
      toast.sucesso(r.mensagem);
      busca.recarregar();
    }
  };

  return { ...busca, salvar, aprovar, recusar, excluir, ocupado };
}
