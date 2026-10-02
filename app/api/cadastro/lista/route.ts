import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/http-client';

// Proxy server-side para o SIAT: evita que o navegador chame o SIAT direto e sofra CORS.
export async function GET(request: NextRequest) {
  const cpfCnpjLogado = request.nextUrl.searchParams.get('cpfCnpjLogado');

  if (!cpfCnpjLogado) {
    return NextResponse.json(
      { mensagens: ['Informe o parâmetro cpfCnpjLogado.'] },
      { status: 400 },
    );
  }

  try {
    const { data } = await apiClient.get('/cadastro/lista', {
      params: { cpfCnpjLogado },
    });

    return NextResponse.json(data);
  } catch (error) {
    const mensagens = axios.isAxiosError(error)
      ? (error.response?.data?.mensagens ?? [error.message])
      : ['Erro ao consultar o SIAT.'];

    return NextResponse.json({ mensagens }, { status: 502 });
  }
}
