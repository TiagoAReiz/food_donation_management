import { EditarDoacao } from "@/modules/doacoes/components/EditarDoacao";

export default async function Page({ params }: PageProps<"/doador/doacoes/[id]/editar">) {
  const { id } = await params;
  return <EditarDoacao id={Number(id)} />;
}
