import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

const CORES = {
  verde: "bg-brand-100 text-brand-800",
  laranja: "bg-accent-100 text-accent-700",
  azul: "bg-blue-100 text-blue-900",
  amarelo: "bg-amber-100 text-amber-900",
  vermelho: "bg-red-100 text-red-900",
};

export function Numero({
  valor,
  texto,
  cor = "verde",
  href,
}: {
  valor: number | undefined;
  texto: string;
  cor?: keyof typeof CORES;
  href?: string;
}) {
  const corpo = (
    <div className={`h-full rounded-3xl p-4 ${CORES[cor]}`}>
      <p className="text-4xl font-extrabold leading-none">{valor ?? 0}</p>
      <p className="mt-2 text-base font-bold leading-snug">{texto}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full transition-transform active:scale-[0.98]">
      {corpo}
    </Link>
  ) : (
    corpo
  );
}

export function Atalho({
  href,
  icone: Icone,
  titulo,
  texto,
  principal,
}: {
  href: string;
  icone: LucideIcon;
  titulo: string;
  texto?: string;
  principal?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-20 items-center gap-4 rounded-3xl border p-4 shadow-sm transition-transform active:scale-[0.98] ${
        principal
          ? "border-accent-600 bg-accent-600 text-white"
          : "border-stone-200 bg-white text-ink hover:border-brand-300"
      }`}
    >
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
          principal ? "bg-white/20" : "bg-brand-100 text-brand-700"
        }`}
      >
        <Icone size={26} />
      </span>
      <span className="flex-1">
        <span className="block text-lg font-extrabold">{titulo}</span>
        {texto && (
          <span className={`block text-sm ${principal ? "text-white/90" : "text-ink-soft"}`}>
            {texto}
          </span>
        )}
      </span>
      <ChevronRight size={22} />
    </Link>
  );
}

export function Grade({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;
}
