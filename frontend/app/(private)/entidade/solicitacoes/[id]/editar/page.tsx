import { EditarSolicitacao } from "@/modules/solicitacoes/components/EditarSolicitacao";

export default async function Page({ params }: PageProps<"/entidade/solicitacoes/[id]/editar">) {
  const { id } = await params;
  return <EditarSolicitacao id={Number(id)} />;
}
