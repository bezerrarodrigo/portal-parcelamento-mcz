import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';

interface CertidaoFinanceiraResponse {
  mensagens?: string[];
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
    const response =
      await internalApiClient.get<CertidaoFinanceiraResponse>(
        '/certidao/imprimeCertidaoFinanceiro',
        { params: { idCadastro: idContrato } },
      );
    data = response.data;
  } catch (error) {
    if (
      axios.isAxiosError<CertidaoFinanceiraResponse>(error) &&
      error.response?.data?.mensagens?.length
    ) {
      throw new Error(error.response.data.mensagens.join(' '));
    }

    throw error;
  }

  if (data.mensagens?.length) {
    throw new Error(data.mensagens.join(' '));
  }
  if (!data.imagem) {
    throw new Error('A API não retornou o arquivo da certidão.');
  }

  const bytes = Uint8Array.from(atob(data.imagem), (caractere) =>
    caractere.charCodeAt(0),
  );
  return new Blob([bytes], { type: 'application/pdf' });
}
