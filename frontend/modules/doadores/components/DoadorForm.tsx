"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Select } from "@/shared/components/ui/Field";
import { Alerta } from "@/shared/components/ui/Card";
import { useEnvio } from "@/shared/hooks/useEnvio";
import { TIPOS_PESSOA } from "@/shared/utils/labels";
import { mascaraDocumento, mascaraTelefone } from "@/shared/utils/masks";
import type { DoadorRequest, DoadorResponse, TipoPessoa } from "@/shared/types";

interface Props {
  inicial?: DoadorResponse;
  /** cadastro: senha obrigatória. edicao: senha opcional. */
  modo: "cadastro" | "edicao";
  rotulo: string;
  onSubmit: (dados: DoadorRequest) => Promise<unknown>;
}

export function DoadorForm({ inicial, modo, rotulo, onSubmit }: Props) {
  const { enviando, campos, erroGeral, executar } = useEnvio();
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [email, setEmail] = useState(inicial?.email ?? "");
  const [telefone, setTelefone] = useState(inicial?.telefone ?? "");
  const [tipo, setTipo] = useState<TipoPessoa>(inicial?.tipoPessoa ?? "FISICA");
  const [documento, setDocumento] = useState(inicial?.documento ?? "");
  const [endereco, setEndereco] = useState(inicial?.endereco ?? "");
  const [senha, setSenha] = useState("");
  const [locais, setLocais] = useState<Record<string, string>>({});

  const erro = (c: string) => locais[c] ?? campos[c];

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const l: Record<string, string> = {};
    if (!nome.trim()) l.nome = "Informe o nome.";
    if (!/^\S+@\S+\.\S+$/.test(email)) l.email = "Informe um e-mail válido.";
    const digitos = documento.replace(/\D/g, "").length;
    if (digitos !== (tipo === "FISICA" ? 11 : 14))
      l.documento = tipo === "FISICA" ? "O CPF tem 11 números." : "O CNPJ tem 14 números.";
    if (modo === "cadastro" && senha.length < 6) l.senha = "A senha precisa ter pelo menos 6 caracteres.";
    if (modo === "edicao" && senha && senha.length < 6) l.senha = "A senha precisa ter pelo menos 6 caracteres.";
    setLocais(l);
    if (Object.keys(l).length) return;

    await executar(() =>
      onSubmit({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone || undefined,
        tipoPessoa: tipo,
        documento,
        endereco: endereco.trim() || undefined,
        senha: senha || undefined,
      }),
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Input label="Nome completo ou da empresa" value={nome} onChange={(e) => setNome(e.target.value)} erro={erro("nome")} autoComplete="name" />
      <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} erro={erro("email")} autoComplete="email" />
      <Input
        label="Telefone (com DDD)"
        type="tel"
        inputMode="tel"
        value={telefone}
        onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
        erro={erro("telefone")}
        placeholder="(11) 91234-5678"
      />
      <Select
        label="Você doa como"
        value={tipo}
        onChange={(e) => {
          setTipo(e.target.value as TipoPessoa);
          setDocumento("");
        }}
        erro={erro("tipoPessoa")}
      >
        {Object.entries(TIPOS_PESSOA).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </Select>
      <Input
        label={tipo === "FISICA" ? "CPF" : "CNPJ"}
        inputMode="numeric"
        value={documento}
        onChange={(e) => setDocumento(mascaraDocumento(e.target.value, tipo))}
        erro={erro("documento")}
        placeholder={tipo === "FISICA" ? "000.000.000-00" : "00.000.000/0000-00"}
      />
      <Input label="Endereço (opcional)" value={endereco} onChange={(e) => setEndereco(e.target.value)} erro={erro("endereco")} autoComplete="street-address" />
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
