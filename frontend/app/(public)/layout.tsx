import type { ReactNode } from "react";
import Link from "next/link";
import { GuardaPublica } from "@/modules/auth/components/GuardaPublica";
import { Logo } from "@/shared/components/layout/Logo";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <GuardaPublica>
      <div className="flex min-h-dvh flex-col bg-gradient-to-b from-brand-50 to-[#fbfaf6]">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-2xl border-2 border-brand-700 px-5 text-base font-bold text-brand-800 hover:bg-brand-100"
          >
            Entrar
          </Link>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-4 sm:px-6">
          {children}
        </main>
        <footer className="px-4 py-6 text-center text-sm text-ink-soft">
          Projeto acadêmico - Universidade Presbiteriana Mackenzie
        </footer>
      </div>
    </GuardaPublica>
  );
}
