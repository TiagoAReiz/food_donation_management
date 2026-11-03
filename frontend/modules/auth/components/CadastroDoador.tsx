"use client";

import Link from "next/link";
import { DoadorForm } from "@/modules/doadores/components/DoadorForm";
import { useCadastroDoador } from "../hooks/useCadastro";

export function CadastroDoador() {
  const cadastrar = useCadastroDoador();
  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-1 text-3xl font-extrabold text-ink">Quero doar alimentos</h1>
      <p className="mb-6 text-base text-ink-soft">
        Preencha seus dados. Leva menos de 2 minutos.
      </p>
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <DoadorForm modo="cadastro" rotulo="Criar minha conta" onSubmit={cadastrar} />
      </div>
      <p className="mt-6 text-center text-base">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-brand-700 underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
