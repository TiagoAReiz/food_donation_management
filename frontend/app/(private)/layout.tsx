"use client";

import type { ReactNode } from "react";
import { GuardaPrivada } from "@/modules/auth/components/GuardaPrivada";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { AppShell } from "@/shared/components/layout/AppShell";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  return (
    <GuardaPrivada>
      {(u) => (
        <AppShell perfil={u.perfil} nome={u.nome} onSair={logout}>
          {children}
        </AppShell>
      )}
    </GuardaPrivada>
  );
}
