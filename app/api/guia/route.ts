import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface ParcelaCalculadaApi {
  id: number;
}

interface ExtratoDebitoApiResponse {
  mensagens?: unknown;
  parcelasCalculadas?: ParcelaCalculadaApi[] | null;
  [campo: string]: unknown;
}

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

interface SolicitacaoEmissao {
  idCadastro?: unknown;
  parcelasSelecionadas?: unknown;
}

function obterIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    ''
  );
}

export async function POST(request: NextRequest) {
  let entrada: unknown;

  try {
    entrada = await request.json();
  } catch {
    return NextResponse.json(
      { mensagens: ['O corpo da requisição é inválido.'] },
      { status: 400 },
    );
  }

  if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) {
    return NextResponse.json(
      { mensagens: ['O corpo da requisição é inválido.'] },
      { status: 400 },
    );
  }

  const solicitacao = entrada as SolicitacaoEmissao;

  if (
    typeof solicitacao.idCadastro !== 'string' ||
    !/^\d+$/.test(solicitacao.idCadastro)
  ) {
    return NextResponse.json(
      { mensagens: ['O identificador do cadastro é inválido.'] },
      { status: 400 },
    );
  }

  if (
    !Array.isArray(solicitacao.parcelasSelecionadas) ||
    solicitacao.parcelasSelecionadas.length === 0 ||
    solicitacao.parcelasSelecionadas.some(
      (id) => typeof id !== 'string' || !/^\d+$/.test(id),
    )
  ) {
    return NextResponse.json(
      { mensagens: ['Selecione ao menos um débito para emitir a guia.'] },
      { status: 400 },
    );
  }

  const idsSelecionados = new Set(solicitacao.parcelasSelecionadas as string[]);

  try {
    const { data: extratoDebito } =
      await apiClient.get<ExtratoDebitoApiResponse>('/extratodebito', {
        params: { idCadastro: solicitacao.idCadastro },
      });

    const mensagensExtrato = normalizarMensagens(extratoDebito.mensagens);
    if (mensagensExtrato.length) {
      return NextResponse.json(
        { mensagens: mensagensExtrato },
        { status: 502 },
      );
    }

    const parcelasCalculadas = extratoDebito.parcelasCalculadas ?? [];
    const parcelasCalculadasSelecionadas = parcelasCalculadas.filter(
      (parcela) => idsSelecionados.has(String(parcela.id)),
    );

    if (parcelasCalculadasSelecionadas.length !== idsSelecionados.size) {
      return NextResponse.json(
        {
          mensagens: [
            'Um ou mais débitos selecionados não estão mais disponíveis. Atualize a página e tente novamente.',
          ],
        },
        { status: 409 },
      );
    }

    const { data: guia } = await apiClient.post<GuiaArrecadacaoApiResponse>(
      '/guia/',
      {
        extratoDebito: { ...extratoDebito, parcelasCalculadas: [] },
        ip: obterIp(request),
        usuario: process.env.SIAT_USUARIO ?? 'portal',
        geraUmDocumentoPorParcela: false,
        parcelasCalculadasSelecionadas,
      },
      { timeout: 60000 },
    );

    return NextResponse.json(guia);
  } catch (error) {
    const mensagens = axios.isAxiosError<GuiaArrecadacaoApiResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    const mensagem =
      mensagens.join(' ') || 'Não foi possível emitir a guia no momento.';

    return NextResponse.json({ mensagens: [mensagem] }, { status: 502 });
  }
}
