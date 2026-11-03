"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { rotaInicial } from "@/shared/utils/labels";
import { useAuth } from "../hooks/useAuth";

/** Já logado: manda para o painel do perfil. Senão mostra a página pública. */
export function GuardaPublica({ children }: { children: ReactNode }) {
  const { pronto, usuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (pronto && usuario) router.replace(rotaInicial(usuario.perfil));
  }, [pronto, usuario, router]);

  if (pronto && usuario) return null;
  return <>{children}</>;
}
