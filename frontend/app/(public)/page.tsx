import { HandHeart, Building2, Truck, Leaf } from "lucide-react";
import { LinkButton } from "@/shared/components/ui/Button";

const PASSOS = [
  {
    icone: HandHeart,
    titulo: "Você doa",
    texto: "Mercados e pessoas cadastram os alimentos que querem doar, com a validade.",
  },
  {
    icone: Building2,
    titulo: "Nós conferimos",
    texto: "A equipe recebe a doação, confere as quantidades e guarda no estoque.",
  },
  {
    icone: Truck,
    titulo: "A entidade pede",
    texto: "Creches e abrigos aprovados pedem o que precisam e recebem a entrega.",
  },
];

export default function Page() {
  return (
    <div className="space-y-12">
      <section className="pt-4 text-center sm:pt-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-4 py-1.5 text-sm font-bold text-accent-700">
          <Leaf size={16} /> Menos desperdício, mais comida na mesa
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-brand-900 sm:text-5xl">
          Alimento que sobra aqui, <span className="text-accent-600">faz falta ali.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          O Alimento Solidário liga quem quer doar comida a creches, abrigos e outras entidades
          que precisam. Tudo simples, pelo celular ou computador.
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <LinkButton href="/cadastro/doador" variante="laranja" icone={<HandHeart size={20} />}>
            Quero doar
          </LinkButton>
          <LinkButton href="/cadastro/entidade" variante="primario" icone={<Building2 size={20} />}>
            Sou uma entidade
          </LinkButton>
          <LinkButton href="/login" variante="secundario">
            Já tenho conta: Entrar
          </LinkButton>
        </div>
      </section>

      <section aria-labelledby="como" className="space-y-5">
        <h2 id="como" className="text-center text-2xl font-extrabold text-ink">
          Como funciona
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
              <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <p.icone size={26} />
              </span>
              <h3 className="text-lg font-extrabold text-ink">
                {i + 1}. {p.titulo}
              </h3>
              <p className="mt-1 text-base text-ink-soft">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
