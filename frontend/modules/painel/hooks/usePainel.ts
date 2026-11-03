"use client";

import { useFetch } from "@/shared/hooks/useFetch";
import { painelService } from "../services/painelService";

export function usePainel() {
  return useFetch("painel", painelService.obter);
}
