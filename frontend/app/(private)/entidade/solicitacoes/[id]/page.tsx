import { DetalheSolicitacao } from "@/modules/solicitacoes/components/DetalheSolicitacao";

export default async function Page({ params }: PageProps<"/entidade/solicitacoes/[id]">) {
  const { id } = await params;
  return <DetalheSolicitacao id={Number(id)} />;
}
