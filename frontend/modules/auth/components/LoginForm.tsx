"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Field";
import { Alerta } from "@/shared/components/ui/Card";
import { useEnvio } from "@/shared/hooks/useEnvio";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const entrar = useLogin();
  const { enviando, campos, erroGeral, executar } = useEnvio();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [locais, setLocais] = useState<Record<string, string>>({});

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const l: Record<string, string> = {};
    if (!email.trim()) l.email = "Digite seu e-mail.";
    if (!senha) l.senha = "Digite sua senha.";
    setLocais(l);
    if (Object.keys(l).length) return;
    await executar(() => entrar(email.trim(), senha));
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-1 text-3xl font-extrabold text-ink">Entrar</h1>
      <p className="mb-6 text-base text-ink-soft">Use o e-mail e a senha do seu cadastro.</p>
      <form
        onSubmit={enviar}
        noValidate
        className="space-y-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
      >
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erro={locais.email ?? campos.email}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          erro={locais.senha ?? campos.senha}
        />
        {erroGeral && <Alerta tom="erro">{erroGeral}</Alerta>}
        <Button type="submit" larga carregando={enviando}>
          Entrar
        </Button>
      </form>
      <div className="mt-6 space-y-2 text-center text-base">
        <p>
          Quer doar?{" "}
          <Link href="/cadastro/doador" className="font-bold text-brand-700 underline">
            Crie sua conta de doador
          </Link>
        </p>
        <p>
          Representa uma entidade?{" "}
          <Link href="/cadastro/entidade" className="font-bold text-brand-700 underline">
            Cadastre a entidade
          </Link>
        </p>
      </div>
    </div>
  );
}
