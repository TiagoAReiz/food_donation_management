import { ConferirDoacao } from "@/modules/doacoes/components/ConferirDoacao";

export default async function Page({ params }: PageProps<"/admin/doacoes/[id]">) {
  const { id } = await params;
  return <ConferirDoacao id={Number(id)} />;
}
