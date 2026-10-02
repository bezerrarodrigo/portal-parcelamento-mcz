import { apiClient } from '@/lib/http-client';

export interface ResumoDebitos {
  vencidos: number;
  aVencer: number;
  total: number;
}

interface DebitoResumoApiItem {
  mensagens?: string[];
  descricao: string;
  total: number;
}

interface ListaDebitosResponse {
  mensagens?: string[];
  debitos: DebitoResumoApiItem[];
}

// Remove acentos para comparar com segurança (API retorna "Á Vencer").
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export async function obterResumoDebitos(
  codigoCadastro: string,
): Promise<ResumoDebitos> {
  const { data } = await apiClient.get<ListaDebitosResponse>('/debito/', {
    params: { codigoCadastro },
  });

  if (data.mensagens?.length) {
    throw new Error(data.mensagens.join(' '));
  }

  const debitos = data.debitos ?? [];
  const vencidos =
    debitos.find((item) => normalizar(item.descricao) === 'vencidos')?.total ??
    0;
  const aVencer =
    debitos.find((item) => normalizar(item.descricao) === 'a vencer')?.total ??
    0;

  return { vencidos, aVencer, total: vencidos + aVencer };
}
