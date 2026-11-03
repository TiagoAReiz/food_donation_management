"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useFetch } from "@/shared/hooks/useFetch";
import { useToast } from "@/shared/hooks/useToast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useAcao } from "@/shared/hooks/useEnvio";
import type { DoadorRequest, EntidadeRequest, ExclusaoResponse } from "@/shared/types";
import { perfilService } from "../services/perfilService";

function useExcluirConta(excluir: () => Promise<ExclusaoResponse>) {
  const { confirmar } = useConfirm();
  const { logout } = useAuth();
  const toast = useToast();
  const { ocupado, executar } = useAcao();

  const excluirConta = async () => {
    const ok = await confirmar({
      titulo: "Excluir minha conta?",
      texto:
        "Você vai sair do sistema e não poderá mais entrar com esta conta. Se houver histórico, a conta será apenas desativada.",
      rotulo: "Sim, excluir minha conta",
      perigo: true,
    });
    if (!ok) return;
    const r = await executar(excluir);
    if (r) {
      toast.sucesso(r.mensagem);
      logout();
    }
  };
  return { excluirConta, excluindo: ocupado };
}

export function useMeuCadastroDoador() {
  const { atualizar } = useAuth();
  const toast = useToast();
  const busca = useFetch("perfil-doador", perfilService.doador);
  const { excluirConta, excluindo } = useExcluirConta(perfilService.excluirDoador);

  const salvar = async (dados: DoadorRequest) => {
    await perfilService.atualizarDoador(dados);
    await atualizar();
    toast.sucesso("Cadastro atualizado!");
    busca.recarregar();
  };
  return { ...busca, salvar, excluirConta, excluindo };
}

export function useMeuCadastroEntidade() {
  const { atualizar } = useAuth();
  const toast = useToast();
  const busca = useFetch("perfil-entidade", perfilService.entidade);
  const { excluirConta, excluindo } = useExcluirConta(perfilService.excluirEntidade);

  const salvar = async (dados: EntidadeRequest) => {
    await perfilService.atualizarEntidade(dados);
    await atualizar();
    toast.sucesso("Cadastro atualizado!");
    busca.recarregar();
  };
  return { ...busca, salvar, excluirConta, excluindo };
}
