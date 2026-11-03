"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Field";
import { Alerta } from "@/shared/components/ui/Card";
import { useEnvio } from "@/shared/hooks/useEnvio";
import { mascaraCnpj, mascaraTelefone } from "@/shared/utils/masks";
import type { EntidadeRequest, EntidadeResponse } from "@/shared/types";

interface Props {
  inicial?: EntidadeResponse;
  modo: "cadastro" | "edicao";
  rotulo: string;
  onSubmit: (dados: EntidadeRequest) => Promise<unknown>;
}

export function EntidadeForm({ inicial, modo, rotulo, onSubmit }: Props) {
  const { enviando, campos, erroGeral, executar } = useEnvio();
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [email, setEmail] = useState(inicial?.email ?? "");
  const [telefone, setTelefone] = useState(inicial?.telefone ?? "");
  const [cnpj, setCnpj] = useState(inicial?.cnpj ?? "");
  const [endereco, setEndereco] = useState(inicial?.endereco ?? "");
  const [responsavel, setResponsavel] = useState(inicial?.responsavel ?? "");
  const [pessoas, setPessoas] = useState(inicial ? String(inicial.pessoasAtendidas) : "");
  const [senha, setSenha] = useState("");
  const [locais, setLocais] = useState<Record<string, string>>({});

  const erro = (c: string) => locais[c] ?? campos[c];

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const l: Record<string, string> = {};
    if (!nome.trim()) l.nome = "Informe o nome da entidade.";
    if (!/^\S+@\S+\.\S+$/.test(email)) l.email = "Informe um e-mail válido.";
    if (cnpj.replace(/\D/g, "").length !== 14) l.cnpj = "O CNPJ tem 14 números.";
    if (!endereco.trim()) l.endereco = "Informe o endereço.";
    if (!responsavel.trim()) l.responsavel = "Informe quem é o responsável.";
    if (!(Number(pessoas) > 0)) l.pessoasAtendidas = "Informe quantas pessoas são atendidas.";
    if (modo === "cadastro" && senha.length < 6) l.senha = "A senha precisa ter pelo menos 6 caracteres.";
    if (modo === "edicao" && senha && senha.length < 6) l.senha = "A senha precisa ter pelo menos 6 caracteres.";
    setLocais(l);
    if (Object.keys(l).length) return;

    await executar(() =>
      onSubmit({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone || undefined,
        cnpj,
        endereco: endereco.trim(),
        responsavel: responsavel.trim(),
        pessoasAtendidas: Number(pessoas),
        senha: senha || undefined,
      }),
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Input label="Nome da entidade" value={nome} onChange={(e) => setNome(e.target.value)} erro={erro("nome")} />
      <Input label="CNPJ" inputMode="numeric" value={cnpj} onChange={(e) => setCnpj(mascaraCnpj(e.target.value))} erro={erro("cnpj")} placeholder="00.000.000/0000-00" />
      <Input label="Nome do responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} erro={erro("responsavel")} />
      <Input label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} erro={erro("endereco")} autoComplete="street-address" />
      <Input
        label="Quantas pessoas vocês atendem?"
        type="number"
        inputMode="numeric"
        min={1}
        value={pessoas}
        onChange={(e) => setPessoas(e.target.value)}
        erro={erro("pessoasAtendidas")}
      />
      <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} erro={erro("email")} autoComplete="email" />
      <Input label="Telefone (com DDD)" type="tel" inputMode="tel" value={telefone} onChange={(e) => setTelefone(mascaraTelefone(e.target.value))} erro={erro("telefone")} placeholder="(11) 91234-5678" />
      <Input
        label={modo === "cadastro" ? "Crie uma senha" : "Nova senha"}
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        erro={erro("senha")}
        dica={modo === "cadastro" ? "Pelo menos 6 caracteres." : "Deixe em branco para manter a senha atual."}
        autoComplete="new-password"
      />
      {erroGeral && <Alerta tom="erro">{erroGeral}</Alerta>}
      <Button type="submit" larga carregando={enviando}>
        {rotulo}
      </Button>
    </form>
  );
}
