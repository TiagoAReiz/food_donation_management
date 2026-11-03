"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type Tipo = "sucesso" | "erro";
interface Item {
  id: number;
  tipo: Tipo;
  texto: string;
}

interface ToastApi {
  sucesso: (texto: string) => void;
  erro: (texto: string) => void;
}

const Ctx = createContext<ToastApi | null>(null);
let contador = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Item[]>([]);

  const remover = useCallback((id: number) => {
    setItens((l) => l.filter((i) => i.id !== id));
  }, []);

  const adicionar = useCallback(
    (tipo: Tipo, texto: string) => {
      const id = ++contador;
      setItens((l) => [...l, { id, tipo, texto }]);
      setTimeout(() => remover(id), tipo === "erro" ? 7000 : 4500);
    },
    [remover],
  );

  const api = useMemo<ToastApi>(
    () => ({
      sucesso: (t) => adicionar("sucesso", t),
      erro: (t) => adicionar("erro", t),
    }),
    [adicionar],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-3"
      >
        {itens.map((i) => (
          <div
            key={i.id}
            role={i.tipo === "erro" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl px-4 py-3 text-base font-semibold shadow-lg ${
              i.tipo === "erro"
                ? "bg-red-700 text-white"
                : "bg-brand-700 text-white"
            }`}
          >
            {i.tipo === "erro" ? (
              <AlertCircle className="mt-0.5 shrink-0" size={20} />
            ) : (
              <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
            )}
            <span className="flex-1">{i.texto}</span>
            <button
              onClick={() => remover(i.id)}
              aria-label="Fechar aviso"
              className="-m-2 rounded-full p-2 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast fora do ToastProvider");
  return c;
}
