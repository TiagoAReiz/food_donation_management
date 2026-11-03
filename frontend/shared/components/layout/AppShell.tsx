"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ellipsis, LogOut } from "lucide-react";
import type { Perfil } from "@/shared/types";
import { PERFIS } from "@/shared/utils/labels";
import { Modal } from "@/shared/components/ui/Modal";
import { Logo } from "./Logo";
import { NAVEGACAO, type ItemNav } from "./nav";

interface Props {
  perfil: Perfil;
  nome: string;
  onSair: () => void;
  children: ReactNode;
}

export function AppShell({ perfil, nome, onSair, children }: Props) {
  const path = usePathname();
  const [maisAberto, setMaisAberto] = useState(false);
  const itens = NAVEGACAO[perfil];
  const raiz = itens[0].href;

  const ativo = (i: ItemNav) =>
    i.href === raiz ? path === raiz : path === i.href || path.startsWith(i.href + "/");

  const precisaMais = itens.length > 5;
  const principais = precisaMais ? itens.slice(0, 4) : itens;
  const extras = precisaMais ? itens.slice(4) : [];
  const extraAtivo = extras.some(ativo);

  return (
    <div className="min-h-dvh bg-brand-50/60 lg:flex">
      {/* Menu lateral (computador) */}
      <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col gap-6 bg-brand-800 p-5 lg:flex">
        <Logo href={raiz} claro />
        <nav aria-label="Menu principal" className="flex flex-1 flex-col gap-1.5">
          {itens.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              aria-current={ativo(i) ? "page" : undefined}
              className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-base font-bold transition-colors ${
                ativo(i) ? "bg-white text-brand-800" : "text-brand-50 hover:bg-brand-700"
              }`}
            >
              <i.icone size={22} />
              {i.texto}
            </Link>
          ))}
        </nav>
        <div className="rounded-2xl bg-brand-900/60 p-4 text-brand-50">
          <p className="text-sm text-brand-200">{PERFIS[perfil]}</p>
          <p className="mb-3 truncate text-base font-bold">{nome}</p>
          <button
            onClick={onSair}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/10 font-bold hover:bg-white/20"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior (celular) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <Logo href={raiz} />
          <button
            onClick={onSair}
            className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-base font-bold text-ink hover:bg-stone-100"
          >
            <LogOut size={18} /> Sair
          </button>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:pb-10 lg:pt-8">
          {children}
        </main>

        {/* Navegação inferior (celular) */}
        <nav
          aria-label="Menu principal"
          className="fixed inset-x-0 bottom-0 z-30 grid border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
          style={{ gridTemplateColumns: `repeat(${principais.length + (precisaMais ? 1 : 0)}, minmax(0, 1fr))` }}
        >
          {principais.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              aria-current={ativo(i) ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-xs font-bold ${
                ativo(i) ? "text-brand-700" : "text-ink-soft"
              }`}
            >
              <span className={`rounded-full px-4 py-1 ${ativo(i) ? "bg-brand-100" : ""}`}>
                <i.icone size={22} />
              </span>
              <span className="max-w-full truncate">{i.texto}</span>
            </Link>
          ))}
          {precisaMais && (
            <button
              onClick={() => setMaisAberto(true)}
              className={`flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-xs font-bold ${
                extraAtivo ? "text-brand-700" : "text-ink-soft"
              }`}
            >
              <span className={`rounded-full px-4 py-1 ${extraAtivo ? "bg-brand-100" : ""}`}>
                <Ellipsis size={22} />
              </span>
              Mais
            </button>
          )}
        </nav>
      </div>

      <Modal aberto={maisAberto} titulo="Mais opções" onFechar={() => setMaisAberto(false)}>
        <div className="flex flex-col gap-2">
          {extras.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setMaisAberto(false)}
              className={`flex min-h-14 items-center gap-3 rounded-2xl px-4 text-lg font-bold ${
                ativo(i) ? "bg-brand-100 text-brand-800" : "bg-stone-100 text-ink"
              }`}
            >
              <i.icone size={22} />
              {i.texto}
            </Link>
          ))}
          <p className="mt-2 text-sm text-ink-soft">
            Você entrou como {nome} ({PERFIS[perfil]}).
          </p>
        </div>
      </Modal>
    </div>
  );
}
