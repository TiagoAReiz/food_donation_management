"use client";

interface Aba<T extends string> {
  valor: T;
  texto: string;
}

export function Abas<T extends string>({
  abas,
  valor,
  onChange,
  rotulo,
}: {
  abas: Aba<T>[];
  valor: T;
  onChange: (v: T) => void;
  rotulo: string;
}) {
  return (
    <div role="tablist" aria-label={rotulo} className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {abas.map((a) => (
        <button
          key={a.valor}
          role="tab"
          aria-selected={a.valor === valor}
          onClick={() => onChange(a.valor)}
          className={`min-h-11 shrink-0 rounded-full px-5 text-base font-bold transition-colors ${
            a.valor === valor
              ? "bg-brand-700 text-white"
              : "bg-white text-ink ring-1 ring-stone-300 hover:bg-brand-50"
          }`}
        >
          {a.texto}
        </button>
      ))}
    </div>
  );
}
