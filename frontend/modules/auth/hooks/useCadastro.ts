"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { rotaInicial } from "@/shared/utils/labels";
import type { DoadorRequest, EntidadeRequest } from "@/shared/types";
import { authService } from "../services/authService";
import { useAuth } from "./useAuth";

/** Depois de criar a conta, já entra com o mesmo e-mail e senha e vai para o painel. */
function useEntrarAposCadastro() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  return useCallback(
    async (email: string, senha: string, mensagem: string) => {
      try {
        const usuario = await login(email, senha);
        toast.sucesso(mensagem);
        router.replace(rotaInicial(usuario.perfil));
      } catch {
        // a conta foi criada; se o login automático falhar, a pessoa entra manualmente
        toast.sucesso("Cadastro feito! Agora é só entrar.");
        router.replace("/login");
      }
    },
    [login, router, toast],
  );
}

export function useCadastroDoador() {
  const entrar = useEntrarAposCadastro();
  return useCallback(
    async (dados: DoadorRequest) => {
      const senha = dados.senha ?? "";
      await authService.cadastrarDoador({ ...dados, senha });
      await entrar(dados.email, senha, "Conta criada! Bem-vindo(a).");
    },
    [entrar],
  );
}

export function useCadastroEntidade() {
  const entrar = useEntrarAposCadastro();
  return useCallback(
    async (dados: EntidadeRequest) => {
      const senha = dados.senha ?? "";
      await authService.cadastrarEntidade({ ...dados, senha });
      await entrar(dados.email, senha, "Cadastro enviado! Você poderá pedir alimentos assim que for aprovado.");
    },
    [entrar],
  );
}
