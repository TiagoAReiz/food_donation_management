"use client";

import {
  ClipboardCheck,
  HandHeart,
  PackageSearch,
  Plus,
  ShoppingBasket,
  Warehouse,
  Building2,
} from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Carregavel } from "@/shared/components/ui/Estados";
import { Alerta, PageHeader } from "@/shared/components/ui/Card";
import type { PainelResponse } from "@/shared/types";
import { usePainel } from "../hooks/usePainel";
import { Atalho, Grade, Numero } from "./Cartoes";

function PrimeiroNome(nome: string) {
  return nome.split(" ")[0];
}

function Doador({ p }: { p: PainelResponse }) {
  return (
    <>
      <Atalho href="/doador/doacoes/nova" icone={Plus} titulo="Nova doação" texto="Cadastre alimentos para doar" principal />
      <Grade>
        <Numero valor={p.doacoesPendentes} texto="Aguardando conferência" cor="amarelo" href="/doador/doacoes" />
        <Numero valor={p.doacoesRecebidas} texto="Doações recebidas" cor="azul" href="/doador/doacoes" />
        <Numero valor={p.totalDoacoes} texto="Doações feitas" cor="verde" href="/doador/doacoes" />
        <Numero valor={p.lotesAindaEmEstoque} texto="Alimentos ainda disponíveis" cor="laranja" href="/doador/alimentos" />
      </Grade>
      <div className="grid gap-3 sm:grid-cols-2">
        <Atalho href="/doador/doacoes" icone={HandHeart} titulo="Minhas doações" texto="Veja como estão" />
        <Atalho href="/doador/alimentos" icone={ShoppingBasket} titulo="Meus alimentos" texto="O que ainda não foi entregue" />
      </div>
    </>
  );
}

function Entidade({ p }: { p: PainelResponse }) {
  return (
    <>
      {p.aprovada === false && (
        <Alerta tom="aviso" titulo="Seu cadastro está aguardando aprovação">
          Assim que a equipe aprovar, você poderá pedir alimentos. Enquanto isso, já dá para ver o
          que está disponível.
        </Alerta>
      )}
      {p.aprovada !== false && (
        <Atalho href="/entidade/solicitacoes/nova" icone={Plus} titulo="Pedir alimentos" texto="Escolha o que sua entidade precisa" principal />
      )}
      <Grade>
        <Numero valor={p.solicitacoesPendentes} texto="Pedidos aguardando aprovação" cor="amarelo" href="/entidade/solicitacoes" />
        <Numero valor={p.solicitacoesAprovadas} texto="Pedidos aprovados" cor="azul" href="/entidade/solicitacoes" />
        <Numero valor={p.solicitacoesEntregues} texto="Pedidos entregues" cor="verde" href="/entidade/solicitacoes" />
        <Numero valor={p.lotesDisponiveis} texto="Alimentos disponíveis" cor="laranja" href="/entidade/estoque" />
      </Grade>
      <div className="grid gap-3 sm:grid-cols-2">
        <Atalho href="/entidade/estoque" icone={Warehouse} titulo="Ver alimentos disponíveis" />
        <Atalho href="/entidade/solicitacoes" icone={PackageSearch} titulo="Meus pedidos" />
      </div>
    </>
  );
}

function Admin({ p }: { p: PainelResponse }) {
  return (
    <>
      <Grade>
        <Numero valor={p.doacoesPendentes} texto="Doações para conferir" cor="amarelo" href="/admin/doacoes" />
        <Numero valor={p.solicitacoesPendentes} texto="Pedidos para aprovar" cor="amarelo" href="/admin/solicitacoes" />
        <Numero valor={p.solicitacoesAprovadas} texto="Entregas a registrar" cor="azul" href="/admin/solicitacoes" />
        <Numero valor={p.entidadesPendentes} texto="Entidades para aprovar" cor="laranja" href="/admin/entidades" />
        <Numero valor={p.lotesEmEstoque} texto="Lotes em estoque" cor="verde" href="/admin/estoque" />
        <Numero valor={p.lotesVencendo7Dias} texto="Vencem em até 7 dias" cor="amarelo" href="/admin/estoque" />
        <Numero valor={p.lotesVencidos} texto="Lotes vencidos" cor="vermelho" href="/admin/estoque" />
      </Grade>
      <div className="grid gap-3 sm:grid-cols-2">
        <Atalho href="/admin/doacoes" icone={ClipboardCheck} titulo="Doações para conferir" texto="Confirmar ou recusar" principal />
        <Atalho href="/admin/solicitacoes" icone={PackageSearch} titulo="Pedidos das entidades" texto="Aprovar e registrar entregas" />
        <Atalho href="/admin/entidades" icone={Building2} titulo="Entidades" texto="Aprovar novos cadastros" />
        <Atalho href="/admin/estoque" icone={Warehouse} titulo="Estoque" texto="Corrigir ou retirar lotes" />
      </div>
    </>
  );
}

export function PainelInicio() {
  const { usuario } = useAuth();
  const { data, erro, carregando, recarregar } = usePainel();

  return (
    <div className="space-y-5">
      <PageHeader
        titulo={`Olá, ${usuario ? PrimeiroNome(usuario.nome) : ""}!`}
        subtitulo="O que você quer fazer hoje?"
      />
      <Carregavel carregando={carregando} erro={erro} data={data} recarregar={recarregar}>
        {(p) =>
          usuario?.perfil === "DOADOR" ? (
            <Doador p={p} />
          ) : usuario?.perfil === "ENTIDADE" ? (
            <Entidade p={p} />
          ) : (
            <Admin p={p} />
          )
        }
      </Carregavel>
    </div>
  );
}
