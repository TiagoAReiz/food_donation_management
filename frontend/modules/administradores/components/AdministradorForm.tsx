"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Field";
import { Alerta } from "@/shared/components/ui/Card";
import { useEnvio } from "@/shared/hooks/useEnvio";
import { mascaraTelefone } from "@/shared/utils/masks";
import type { AdministradorRequest, UsuarioResponse } from "@/shared/types";

interface Props {
  inicial?: UsuarioResponse;
  rotulo: string;
  onSubmit: (dados: AdministradorRequest) => Promise<unknown>;
}

export function AdministradorForm({ inicial, rotulo, onSubmit }: Props) {
  const { enviando, campos, erroGeral, executar } = useEnvio();
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [email, setEmail] = useState(inicial?.email ?? "");
  const [telefone, setTelefone] = useState(inicial?.telefone ?? "");
  const [senha, setSenha] = useState("");
  const [locais, setLocais] = useState<Record<string, string>>({});
  const novo = !inicial;
  const erro = (c: string) => locais[c] ?? campos[c];

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const l: Record<string, string> = {};
    if (!nome.trim()) l.nome = "Informe o nome.";
    if (!/^\S+@\S+\.\S+$/.test(email)) l.email = "Informe um e-mail válido.";
    if (novo && senha.length < 6) l.senha = "A senha precisa ter pelo menos 6 caracteres.";
    if (!novo && senha && senha.length < 6) l.senha = "A senha precisa ter pelo menos 6 caracteres.";
    setLocais(l);
    if (Object.keys(l).length) return;
    await executar(() =>
      onSubmit({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone || undefined,
        senha: senha || undefined,
      }),
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} erro={erro("nome")} />
      <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} erro={erro("email")} />
      <Input label="Telefone (opcional)" type="tel" inputMode="tel" value={telefone} onChange={(e) => setTelefone(mascaraTelefone(e.target.value))} erro={erro("telefone")} />
      <Input
        label={novo ? "Senha" : "Nova senha"}
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        erro={erro("senha")}
        dica={novo ? "Pelo menos 6 caracteres." : "Deixe em branco para manter a senha atual."}
        autoComplete="new-password"
      />
      {erroGeral && <Alerta tom="erro">{erroGeral}</Alerta>}
      <Button type="submit" larga carregando={enviando}>
        {rotulo}
      </Button>
    </form>
  );
}
