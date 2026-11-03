"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "@/shared/components/ui/Estados";
import { rotaInicial } from "@/shared/utils/labels";
import type { MeResponse, Perfil } from "@/shared/types";
import { useAuth } from "../hooks/useAuth";

const PREFIXOS: Record<string, Perfil> = {
  "/doador": "DOADOR",
  "/entidade": "ENTIDADE",
  "/admin": "ADMINISTRADOR",
};

function perfilDaRota(path: string): Perfil | null {
  const topo = "/" + path.split("/")[1];
  return PREFIXOS[topo] ?? null;
}

/** Sem login vai para /login. Perfil errado vai para o painel do próprio perfil. */
export function GuardaPrivada({
  children,
}: {
  children: (usuario: MeResponse) => ReactNode;
}) {
  const { pronto, usuario } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const exigido = perfilDaRota(path);

  const liberado = pronto && !!usuario && (!exigido || usuario.perfil === exigido);

  useEffect(() => {
    if (!pronto) return;
    if (!usuario) router.replace("/login");
    else if (exigido && usuario.perfil !== exigido) router.replace(rotaInicial(usuario.perfil));
  }, [pronto, usuario, exigido, router]);

  if (!liberado || !usuario) {
    return (
      <div className="min-h-dvh bg-brand-50">
        <Spinner />
      </div>
    );
  }
  return <>{children(usuario)}</>;
}
