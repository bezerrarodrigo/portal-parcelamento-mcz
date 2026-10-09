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

const filtrosLong = ['idLancamento', 'dataPagamentoIni', 'dataPagamentoFim'] as const;

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
  const anoExercicio = query.get('anoExercicio')?.trim();
  if (anoExercicio) {
    if (!/^\d{4}$/.test(anoExercicio)) {
      return NextResponse.json(
        { mensagens: ['O exercício deve conter quatro dígitos.'] },
        { status: 400 },
      );
    }
    params.set('anoExercicio', anoExercicio);
  }

  for (const nome of filtrosLong) {
    const valor = query.get(nome)?.trim();
    if (!valor) continue;
    if (!eLongValido(valor)) {
      return NextResponse.json(
        { mensagens: [`O parâmetro ${nome} deve ser um número válido.`] },
        { status: 400 },
      );
    }
    params.set(nome, valor);
  }

  try {
    const { data } = await apiClient.get<ArquivoResponse | null>(
      '/extratopagamento/relatorio',
      { params, timeout: 60000 },
    );

    return NextResponse.json(data);
  } catch (error) {
    const mensagens = axios.isAxiosError<ArquivoResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    const mensagem =
      mensagens.join(' ') ||
      'Não foi possível emitir o extrato de pagamentos no momento.';

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
