"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useToast } from "@/shared/hooks/useToast";
import type { DoadorRequest, EntidadeRequest } from "@/shared/types";
import { authService } from "../services/authService";

export function useCadastroDoador() {
  const router = useRouter();
  const toast = useToast();
  return useCallback(
    async (dados: DoadorRequest) => {
      await authService.cadastrarDoador({ ...dados, senha: dados.senha ?? "" });
      toast.sucesso("Cadastro feito! Agora é só entrar.");
      router.replace("/login");
    },
    [router, toast],
  );
}

export function useCadastroEntidade() {
  const router = useRouter();
  const toast = useToast();
  return useCallback(
    async (dados: EntidadeRequest) => {
      await authService.cadastrarEntidade({ ...dados, senha: dados.senha ?? "" });
      toast.sucesso("Cadastro enviado! Você já pode entrar; a aprovação vem em seguida.");
      router.replace("/login");
    },
    [router, toast],
  );
}
