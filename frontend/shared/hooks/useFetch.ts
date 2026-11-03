"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mensagemDeErro } from "@/shared/services/api";

interface Resultado<T> {
  chave: string;
  data?: T;
  erro?: string;
}

/**
 * Carrega dados ao montar (e quando `chave` muda). `recarregar` busca de novo.
 * O fetcher pode mudar a cada render; só a chave dispara nova busca.
 */
export function useFetch<T>(chave: string, fetcher: () => Promise<T>, ativo = true) {
  const [nonce, setNonce] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const chaveAtual = `${chave}#${nonce}`;

  useEffect(() => {
    if (!ativo) return;
    let cancelado = false;
    fetcherRef
      .current()
      .then((data) => {
        if (!cancelado) setResultado({ chave: chaveAtual, data });
      })
      .catch((e) => {
        if (!cancelado) setResultado({ chave: chaveAtual, erro: mensagemDeErro(e) });
      });
    return () => {
      cancelado = true;
    };
  }, [chaveAtual, ativo]);

  const recarregar = useCallback(() => setNonce((n) => n + 1), []);
  const pronto = resultado?.chave === chaveAtual;

  return {
    data: resultado?.data,
    erro: pronto ? resultado?.erro : undefined,
    carregando: ativo && !pronto,
    recarregar,
  };
}
