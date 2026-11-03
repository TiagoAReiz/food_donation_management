"use client";

import { useCallback, useState } from "react";
import { ApiError, mensagemDeErro } from "@/shared/services/api";
import { useToast } from "./useToast";

/**
 * Para formulários: guarda o estado de "enviando", os erros por campo
 * (devolvidos pelo servidor) e a mensagem geral.
 */
export function useEnvio() {
  const [enviando, setEnviando] = useState(false);
  const [campos, setCampos] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState("");

  const limpar = useCallback(() => {
    setCampos({});
    setErroGeral("");
  }, []);

  const executar = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    setEnviando(true);
    setCampos({});
    setErroGeral("");
    try {
      return await fn();
    } catch (e) {
      if (e instanceof ApiError && e.campos) setCampos(e.campos);
      setErroGeral(mensagemDeErro(e));
      return undefined;
    } finally {
      setEnviando(false);
    }
  }, []);

  return { enviando, campos, erroGeral, executar, limpar, setCampos, setErroGeral };
}

/**
 * Para botões de ação (aprovar, cancelar...): mostra aviso de sucesso/erro
 * e controla o estado de "ocupado".
 */
export function useAcao() {
  const toast = useToast();
  const [ocupado, setOcupado] = useState(false);

  const executar = useCallback(
    async <T,>(fn: () => Promise<T>, sucesso?: string): Promise<T | undefined> => {
      setOcupado(true);
      try {
        const r = await fn();
        if (sucesso) toast.sucesso(sucesso);
        return r;
      } catch (e) {
        toast.erro(mensagemDeErro(e));
        return undefined;
      } finally {
        setOcupado(false);
      }
    },
    [toast],
  );

  return { ocupado, executar };
}
