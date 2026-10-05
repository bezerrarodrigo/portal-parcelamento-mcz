import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/http-client';
import { validarDadosSimulacao } from '@/lib/api/validar-dados-simulacao';

interface SimulacaoResponse {
  mensagens?: string[];
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

  const validacao = validarDadosSimulacao(entrada);
  if (validacao.erro !== undefined) {
    return NextResponse.json({ mensagens: [validacao.erro] }, { status: 400 });
  }

  try {
    const { data } = await apiClient.post('/parcelamento/', validacao.corpo, {
      timeout: 60000,
    });

    return NextResponse.json(data);
  } catch (error) {
    const mensagens = axios.isAxiosError<SimulacaoResponse>(error)
      ? (error.response?.data?.mensagens ?? [error.message])
      : ['Erro ao simular o parcelamento no SIAT.'];

    return NextResponse.json({ mensagens }, { status: 502 });
  }
}
