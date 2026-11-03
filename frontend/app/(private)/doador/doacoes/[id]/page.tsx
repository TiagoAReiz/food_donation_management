import { DetalheDoacao } from "@/modules/doacoes/components/DetalheDoacao";

export default async function Page({ params }: PageProps<"/doador/doacoes/[id]">) {
  const { id } = await params;
  return <DetalheDoacao id={Number(id)} />;
}
