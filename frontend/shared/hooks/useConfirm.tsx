"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Textarea } from "@/shared/components/ui/Field";

interface OpcoesConfirmar {
  titulo: string;
  texto?: string;
  rotulo?: string;
  perigo?: boolean;
}
interface OpcoesMotivo {
  titulo: string;
  texto?: string;
  rotulo?: string;
  rotuloCampo?: string;
  obrigatorio?: boolean;
}

interface Api {
  /** Abre um modal de confirmação; resolve true se confirmou. */
  confirmar: (o: OpcoesConfirmar) => Promise<boolean>;
  /** Abre um modal pedindo um texto; resolve o texto ou null se cancelou. */
  pedirMotivo: (o: OpcoesMotivo) => Promise<string | null>;
}

type Estado =
  | { tipo: "confirmar"; o: OpcoesConfirmar }
  | { tipo: "motivo"; o: OpcoesMotivo }
  | null;

const Ctx = createContext<Api | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(null);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const resolver = useRef<((v: boolean | string | null) => void) | null>(null);

  const abrir = useCallback((e: NonNullable<Estado>) => {
    setTexto("");
    setErro("");
    setEstado(e);
    return new Promise<boolean | string | null>((res) => {
      resolver.current = res;
    });
  }, []);

  const api = useMemo<Api>(
    () => ({
      confirmar: (o) => abrir({ tipo: "confirmar", o }).then((v) => v === true),
      pedirMotivo: (o) =>
        abrir({ tipo: "motivo", o }).then((v) => (typeof v === "string" ? v : null)),
    }),
    [abrir],
  );

  function fechar(valor: boolean | string | null) {
    resolver.current?.(valor);
    resolver.current = null;
    setEstado(null);
  }

  function enviarMotivo() {
    if (estado?.tipo !== "motivo") return;
    const obrigatorio = estado.o.obrigatorio !== false;
    if (obrigatorio && !texto.trim()) {
      setErro("Escreva o motivo para continuar.");
      return;
    }
    fechar(texto.trim());
  }

  return (
    <Ctx.Provider value={api}>
      {children}
      <Modal
        aberto={estado !== null}
        titulo={estado?.o.titulo ?? ""}
        onFechar={() => fechar(estado?.tipo === "confirmar" ? false : null)}
        rodape={
          estado?.tipo === "confirmar" ? (
            <>
              <Button variante="fantasma" onClick={() => fechar(false)}>
                Voltar
              </Button>
              <Button
                variante={estado.o.perigo ? "perigo" : "primario"}
                onClick={() => fechar(true)}
              >
                {estado.o.rotulo ?? "Confirmar"}
              </Button>
            </>
          ) : estado?.tipo === "motivo" ? (
            <>
              <Button variante="fantasma" onClick={() => fechar(null)}>
                Voltar
              </Button>
              <Button variante="perigo" onClick={enviarMotivo}>
                {estado.o.rotulo ?? "Enviar"}
              </Button>
            </>
          ) : undefined
        }
      >
        {estado?.o.texto && <p className="mb-3 text-base text-ink">{estado.o.texto}</p>}
        {estado?.tipo === "motivo" && (
          <Textarea
            label={estado.o.rotuloCampo ?? "Motivo"}
            value={texto}
            erro={erro}
            onChange={(e) => {
              setTexto(e.target.value);
              setErro("");
            }}
          />
        )}
      </Modal>
    </Ctx.Provider>
  );
}

export function useConfirm(): Api {
  const c = useContext(Ctx);
  if (!c) throw new Error("useConfirm fora do DialogProvider");
  return c;
}
