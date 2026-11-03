import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variante = "primario" | "secundario" | "perigo" | "fantasma" | "laranja";

const ESTILOS: Record<Variante, string> = {
  primario: "bg-brand-700 text-white hover:bg-brand-800 shadow-sm",
  laranja: "bg-accent-600 text-white hover:bg-accent-700 shadow-sm",
  secundario:
    "bg-white text-brand-800 border-2 border-brand-700 hover:bg-brand-50",
  perigo: "bg-red-700 text-white hover:bg-red-800 shadow-sm",
  fantasma: "bg-transparent text-ink hover:bg-stone-100",
};

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  carregando?: boolean;
  larga?: boolean;
  icone?: ReactNode;
}

export function Button({
  variante = "primario",
  carregando,
  larga,
  icone,
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || carregando}
      className={`${BASE} ${ESTILOS[variante]} ${larga ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {carregando ? <Loader2 className="animate-spin" size={20} /> : icone}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variante = "primario",
  larga,
  icone,
  children,
  className = "",
}: {
  href: string;
  variante?: Variante;
  larga?: boolean;
  icone?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${BASE} ${ESTILOS[variante]} ${larga ? "w-full" : ""} ${className}`}
    >
      {icone}
      {children}
    </Link>
  );
}
