import {
  Apple,
  Building2,
  ClipboardList,
  HandHeart,
  Home,
  PackageSearch,
  ShieldCheck,
  User,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { Perfil } from "@/shared/types";

export interface ItemNav {
  href: string;
  texto: string;
  icone: LucideIcon;
}

export const NAVEGACAO: Record<Perfil, ItemNav[]> = {
  DOADOR: [
    { href: "/doador", texto: "Início", icone: Home },
    { href: "/doador/doacoes", texto: "Minhas doações", icone: HandHeart },
    { href: "/doador/alimentos", texto: "Meus alimentos", icone: Apple },
    { href: "/doador/cadastro", texto: "Meu cadastro", icone: User },
  ],
  ENTIDADE: [
    { href: "/entidade", texto: "Início", icone: Home },
    { href: "/entidade/estoque", texto: "Alimentos disponíveis", icone: Warehouse },
    { href: "/entidade/solicitacoes", texto: "Meus pedidos", icone: ClipboardList },
    { href: "/entidade/cadastro", texto: "Meu cadastro", icone: User },
  ],
  ADMINISTRADOR: [
    { href: "/admin", texto: "Início", icone: Home },
    { href: "/admin/doacoes", texto: "Doações", icone: HandHeart },
    { href: "/admin/estoque", texto: "Estoque", icone: Warehouse },
    { href: "/admin/solicitacoes", texto: "Pedidos", icone: PackageSearch },
    { href: "/admin/entidades", texto: "Entidades", icone: Building2 },
    { href: "/admin/doadores", texto: "Doadores", icone: Users },
    { href: "/admin/administradores", texto: "Administradores", icone: ShieldCheck },
  ],
};
