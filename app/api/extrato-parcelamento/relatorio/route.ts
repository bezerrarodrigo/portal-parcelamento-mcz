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
  const idContrato = request.nextUrl.searchParams.get('idContrato')?.trim();

  if (!idContrato || !eLongValido(idContrato)) {
    return NextResponse.json(
      {
        mensagens: [
          'O identificador do contrato é obrigatório e deve ser válido.',
        ],
      },
      { status: 400 },
    );
  }

  try {
    const { data } = await apiClient.get<ArquivoResponse | null>(
      '/extratoparcelamento/relatorio',
      {
        params: { idContrato },
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
      'Não foi possível emitir o extrato de parcelamento no momento.';

    return NextResponse.json({ mensagens: [mensagem] }, { status: 502 });
  }
}

function eLongValido(valor: string): boolean {
  if (!/^\d{1,19}$/.test(valor)) return false;
  const normalizado = valor.replace(/^0+(?=\d)/, '');
  const limiteLong = '9223372036854775807';
  return (
    normalizado.length < limiteLong.length ||
    (normalizado.length === limiteLong.length &&
      normalizado <= limiteLong)
  );
}
