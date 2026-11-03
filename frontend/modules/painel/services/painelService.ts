import { api } from "@/shared/services/api";
import type { PainelResponse } from "@/shared/types";

export const painelService = {
  obter: () => api.get<PainelResponse>("/api/painel").then((r) => r.data),
};
