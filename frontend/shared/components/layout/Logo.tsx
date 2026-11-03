import Link from "next/link";
import { Wheat } from "lucide-react";

export function Logo({ href = "/", claro }: { href?: string; claro?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="Alimento Solidário, página inicial">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-sm">
        <Wheat size={22} />
      </span>
      <span className={`text-xl font-extrabold leading-none ${claro ? "text-white" : "text-brand-800"}`}>
        Alimento
        <br />
        <span className={claro ? "text-accent-200" : "text-accent-600"}>Solidário</span>
      </span>
    </Link>
  );
}
