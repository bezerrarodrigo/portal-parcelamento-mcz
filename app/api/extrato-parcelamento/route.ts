import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const idCadastro = query.get('idCadastro')?.trim();

  if (!idCadastro || !eLongValido(idCadastro)) {
    return NextResponse.json(
      {
        mensagens: [
          'O identificador do cadastro é obrigatório e deve ser válido.',
        ],
      },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({ idCadastro });
  const idContrato = query.get('idContrato')?.trim();
  if (idContrato) {
    if (!eLongValido(idContrato)) {
      return NextResponse.json(
        { mensagens: ['O identificador do contrato deve ser válido.'] },
        { status: 400 },
      );
    }
    params.set('idContrato', idContrato);
  }

  try {
    const { data } = await apiClient.get('/extratoparcelamento/', { params });
    return NextResponse.json(data);
  } catch (error) {
    const mensagens = axios.isAxiosError(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    const mensagem =
      mensagens.join(' ') ||
      'Não foi possível consultar os contratos de parcelamento no momento.';

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
