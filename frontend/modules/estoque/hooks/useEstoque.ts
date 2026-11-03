"use client";

import { useFetch } from "@/shared/hooks/useFetch";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useAcao } from "@/shared/hooks/useEnvio";
import { estoqueService } from "../services/estoqueService";

export function useEstoque() {
  return useFetch("estoque", estoqueService.listar);
}

export function useEstoqueVencido() {
  return useFetch("estoque-vencidos", estoqueService.vencidos);
}

/** Ações do administrador sobre um lote do estoque. */
export function useAcoesEstoque(aoConcluir: () => void) {
  const { pedirMotivo } = useConfirm();
  const { ocupado, executar } = useAcao();

  const corrigir = async (id: number, qtd: number) => {
    const r = await executar(() => estoqueService.corrigir(id, qtd), "Quantidade corrigida.");
    if (r) aoConcluir();
    return !!r;
  };

  const retirar = async (id: number, nome: string) => {
    const motivo = await pedirMotivo({
      titulo: `Retirar "${nome}" do estoque?`,
      texto: "O lote deixa de aparecer como disponível. Use quando o alimento venceu ou estragou.",
      rotulo: "Retirar do estoque",
      rotuloCampo: "Motivo (opcional)",
      obrigatorio: false,
    });
    if (motivo === null) return;
    const r = await executar(
      () => estoqueService.retirar(id, motivo || undefined),
      "Lote retirado do estoque.",
    );
    if (r) aoConcluir();
  };

  return { corrigir, retirar, ocupado };
}
