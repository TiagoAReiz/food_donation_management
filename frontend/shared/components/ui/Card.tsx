import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  destaque,
}: {
  children: ReactNode;
  className?: string;
  destaque?: "alerta" | "perigo";
}) {
  const borda =
    destaque === "perigo"
      ? "border-red-300 bg-red-50"
      : destaque === "alerta"
        ? "border-amber-300 bg-amber-50"
        : "border-stone-200 bg-white";
  return (
    <div className={`rounded-3xl border p-4 shadow-sm sm:p-5 ${borda} ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  titulo,
  subtitulo,
  acoes,
}: {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-base text-ink-soft">{subtitulo}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}

export function Alerta({
  tom = "info",
  titulo,
  children,
}: {
  tom?: "info" | "aviso" | "erro" | "sucesso";
  titulo?: string;
  children?: ReactNode;
}) {
  const t = {
    info: "border-blue-300 bg-blue-50 text-blue-950",
    aviso: "border-amber-300 bg-amber-50 text-amber-950",
    erro: "border-red-300 bg-red-50 text-red-950",
    sucesso: "border-green-300 bg-green-50 text-green-950",
  }[tom];
  return (
    <div role={tom === "erro" ? "alert" : undefined} className={`rounded-2xl border-2 p-4 ${t}`}>
      {titulo && <p className="font-extrabold">{titulo}</p>}
      {children && <div className="text-base">{children}</div>}
    </div>
  );
}
