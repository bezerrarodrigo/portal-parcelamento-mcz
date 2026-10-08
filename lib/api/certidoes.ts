import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface CertidaoFinanceiraResponse {
  mensagens?: unknown;
  imagem?: string;
}

export async function obterCertidaoFinanceira(
  idContrato: string,
): Promise<Blob> {
  if (!/^\d+$/.test(idContrato)) {
    throw new Error('O identificador do contrato é inválido.');
  }

  let data: CertidaoFinanceiraResponse;

  try {
    const response = await internalApiClient.get<CertidaoFinanceiraResponse>(
      '/certidao/imprimeCertidaoFinanceiro',
      { params: { idCadastro: idContrato } },
    );
    data = response.data;
  } catch (error) {
    const mensagens = axios.isAxiosError<CertidaoFinanceiraResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    throw error;
  }

  const mensagens = normalizarMensagens(data.mensagens);
  if (mensagens.length) {
    throw new Error(mensagens.join(' '));
  }
  if (!data.imagem) {
    throw new Error('A API não retornou o arquivo da certidão.');
  }

  const bytes = Uint8Array.from(atob(data.imagem), (caractere) =>
    caractere.charCodeAt(0),
  );
  return new Blob([bytes], { type: 'application/pdf' });
}
