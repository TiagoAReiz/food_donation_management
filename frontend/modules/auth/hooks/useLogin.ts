"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { rotaInicial } from "@/shared/utils/labels";
import { useAuth } from "./useAuth";

export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useCallback(
    async (email: string, senha: string) => {
      const usuario = await login(email, senha);
      router.replace(rotaInicial(usuario.perfil));
    },
    [login, router],
  );
}
