import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface CertidaoFinanceiraResponse {
  mensagens?: unknown;
  imagem?: string;
}

export async function GET(request: NextRequest) {
  const idCadastro = request.nextUrl.searchParams.get('idCadastro');

  if (!idCadastro || !/^\d+$/.test(idCadastro)) {
    return NextResponse.json(
      { mensagens: ['Informe um parâmetro idCadastro válido.'] },
      { status: 400 },
    );
  }

  try {
    const { data } = await apiClient.get<CertidaoFinanceiraResponse>(
      '/certidao/imprimeCertidaoFinanceiro',
      { params: { idCadastro } },
    );

    return NextResponse.json(data);
  } catch (error) {
    const mensagensApi = axios.isAxiosError<CertidaoFinanceiraResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    const mensagens = mensagensApi.length
      ? mensagensApi
      : [
          axios.isAxiosError(error)
            ? error.message
            : 'Erro ao gerar a certidão no SIAT.',
        ];

    return NextResponse.json({ mensagens }, { status: 502 });
  }
}
