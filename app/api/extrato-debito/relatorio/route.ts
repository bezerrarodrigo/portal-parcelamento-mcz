import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface ArquivoResponse {
  mensagens?: unknown;
  imagem?: string;
  tipo?: string;
  nome?: string;
}

export async function GET(request: NextRequest) {
  const idCadastro = request.nextUrl.searchParams.get('idCadastro');

  if (!idCadastro || !/^\d+$/.test(idCadastro)) {
    return NextResponse.json(
      { mensagens: ['O identificador do cadastro é obrigatório e deve ser válido.'] },
      { status: 400 },
    );
  }

  try {
    const { data } = await apiClient.get<ArquivoResponse | null>(
      '/extratodebito/relatorio',
      {
        params: {
          idCadastro,
          ip:
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            request.headers.get('x-real-ip') ??
            '',
          usuario: process.env.SIAT_USUARIO ?? 'portal',
        },
        timeout: 60000,
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    const mensagens = axios.isAxiosError<ArquivoResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    const mensagem =
      mensagens.join(' ') ||
      'Não foi possível emitir o extrato de débitos no momento.';

    return NextResponse.json({ mensagens: [mensagem] }, { status: 502 });
  }
}
