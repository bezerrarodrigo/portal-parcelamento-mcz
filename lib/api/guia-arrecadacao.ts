import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface GuiaArrecadacaoApiResponse {
  mensagens?: unknown;
  imagem?: string;
  tipo?: string;
  nome?: string;
  valor?: string | null;
  vencimento?: string | null;
  codigoBarra?: string | null;
  linhaDigitavel?: string | null;
  qrCode?: string | null;
  linkQrCode?: string | null;
  linkPagamento?: string | null;
}

export interface GuiaArrecadacao {
  arquivo: Blob;
  nome: string;
  valor: string | null;
  vencimento: string | null;
  codigoBarra: string | null;
  linhaDigitavel: string | null;
  qrCode: string | null;
  linkQrCode: string | null;
  linkPagamento: string | null;
}

export async function emitirGuiaArrecadacao(
  idCadastro: string,
  parcelasSelecionadas: string[],
): Promise<GuiaArrecadacao> {
  let data: GuiaArrecadacaoApiResponse;

  try {
    const response = await internalApiClient.post<GuiaArrecadacaoApiResponse>(
      '/guia',
      { idCadastro, parcelasSelecionadas },
      { timeout: 65000 },
    );
    data = response.data;
  } catch (error) {
    const mensagens = axios.isAxiosError<GuiaArrecadacaoApiResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    throw new Error('Não foi possível emitir a guia. Tente novamente.');
  }

  const mensagens = normalizarMensagens(data.mensagens);
  if (mensagens.length) {
    throw new Error(mensagens.join(' '));
  }
  if (!data.imagem) {
    throw new Error('A API não retornou o arquivo PDF da guia.');
  }

  const bytes = Uint8Array.from(atob(data.imagem), (caractere) =>
    caractere.charCodeAt(0),
  );

  return {
    arquivo: new Blob([bytes], { type: data.tipo ?? 'application/pdf' }),
    nome: data.nome ?? 'Guia Dam.pdf',
    valor: data.valor ?? null,
    vencimento: data.vencimento ?? null,
    codigoBarra: data.codigoBarra ?? null,
    linhaDigitavel: data.linhaDigitavel ?? null,
    qrCode: data.qrCode ?? null,
    linkQrCode: data.linkQrCode ?? null,
    linkPagamento: data.linkPagamento ?? null,
  };
}
