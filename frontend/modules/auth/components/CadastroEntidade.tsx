"use client";

import Link from "next/link";
import { EntidadeForm } from "@/modules/entidades/components/EntidadeForm";
import { useCadastroEntidade } from "../hooks/useCadastro";

export function CadastroEntidade() {
  const cadastrar = useCadastroEntidade();
  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-1 text-3xl font-extrabold text-ink">Cadastrar minha entidade</h1>
      <p className="mb-6 text-base text-ink-soft">
        Depois do cadastro, nossa equipe confere os dados e aprova a entidade para pedir
        alimentos.
      </p>
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <EntidadeForm modo="cadastro" rotulo="Enviar cadastro" onSubmit={cadastrar} />
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
