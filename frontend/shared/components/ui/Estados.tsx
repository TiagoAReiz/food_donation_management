import type { ReactNode } from "react";
import { Inbox, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "./Button";

export function Spinner({ texto = "Carregando..." }: { texto?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-12 text-lg font-semibold text-ink-soft"
    >
      <Loader2 className="animate-spin text-brand-700" size={28} />
      {texto}
    </div>
  );
}

export function EmptyState({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-stone-300 bg-white px-6 py-10 text-center">
      <Inbox className="mb-3 text-stone-400" size={44} />
      <p className="text-lg font-extrabold text-ink">{titulo}</p>
      {texto && <p className="mt-1 max-w-md text-base text-ink-soft">{texto}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}

export function ErroEstado({
  mensagem,
  onTentar,
}: {
  mensagem: string;
  onTentar?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-3xl border-2 border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <TriangleAlert className="mb-3 text-red-700" size={44} />
      <p className="text-lg font-extrabold text-red-900">Não deu certo</p>
      <p className="mt-1 max-w-md text-base text-red-900">{mensagem}</p>
      {onTentar && (
        <Button className="mt-4" variante="secundario" onClick={onTentar}>
          Tentar de novo
        </Button>
      )}
    </div>
  );
}

/** Mostra carregando / erro / vazio / conteúdo. */
export function Carregavel<T>({
  carregando,
  erro,
  data,
  recarregar,
  vazio,
  children,
}: {
  carregando: boolean;
  erro?: string;
  data: T | undefined;
  recarregar?: () => void;
  vazio?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (carregando) return <Spinner />;
  if (erro) return <ErroEstado mensagem={erro} onTentar={recarregar} />;
  if (data === undefined) return null;
  if (vazio && Array.isArray(data) && data.length === 0) return <>{vazio}</>;
  return <>{children(data)}</>;
}
