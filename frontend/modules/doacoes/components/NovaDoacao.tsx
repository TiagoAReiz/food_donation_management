"use client";

import { PageHeader } from "@/shared/components/ui/Card";
import { DoacaoFormulario } from "./DoacaoFormulario";
import { useSalvarDoacao } from "../hooks/useDoacoes";

export function NovaDoacao() {
  const salvar = useSalvarDoacao();
  return (
    <>
      <PageHeader titulo="Nova doação" subtitulo="Conte quais alimentos você quer doar." />
      <DoacaoFormulario rotulo="Enviar doação" onSubmit={salvar} />
    </>
  );
}
