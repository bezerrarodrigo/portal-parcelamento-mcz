import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface ArquivoResponse {
  mensagens?: unknown;
  imagem?: string;
  tipo?: string;
  nome?: string;
}

export interface RelatorioExtratoDebito {
  arquivo: Blob;
  nome: string;
}

export async function emitirRelatorioExtratoDebito(
  idCadastro: string,
): Promise<RelatorioExtratoDebito> {
  let data: ArquivoResponse | null;

  try {
    const response = await internalApiClient.get<ArquivoResponse | null>(
      '/extrato-debito/relatorio',
      { params: { idCadastro }, timeout: 65000 },
    );
    data = response.data;
  } catch (error) {
    const mensagens = axios.isAxiosError<ArquivoResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    throw new Error(
      'Não foi possível emitir o extrato de débitos. Tente novamente.',
    );
  }

  const mensagens = normalizarMensagens(data?.mensagens);
  if (mensagens.length) {
    throw new Error(mensagens.join(' '));
  }
  if (!data?.imagem) {
    throw new Error('A API não retornou o arquivo PDF do extrato de débitos.');
  }

  const bytes = Uint8Array.from(atob(data.imagem), (caractere) =>
    caractere.charCodeAt(0),
  );

  return {
    arquivo: new Blob([bytes], { type: data.tipo ?? 'application/pdf' }),
    nome: data.nome ?? 'Extrato de Débitos.pdf',
  };
}
