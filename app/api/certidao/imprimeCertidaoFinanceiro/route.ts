import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/http-client';

interface CertidaoFinanceiraResponse {
  mensagens?: string[];
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
    const mensagens = axios.isAxiosError<CertidaoFinanceiraResponse>(error)
      ? (error.response?.data?.mensagens ?? [error.message])
      : ['Erro ao gerar a certidão no SIAT.'];

    return NextResponse.json({ mensagens }, { status: 502 });
  }
}
