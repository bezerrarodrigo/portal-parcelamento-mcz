import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import type { Cadastro } from '@/lib/mock-cadastros';

interface CadastroApiItem {
  mensagens?: string[];
  id: number;
  tipoCadastro: string;
  nome: string;
  chave: string;
  tipoCadastroPortal: Cadastro['cadastro'];
  linha1Endereco?: string;
  linha2Endereco?: string;
  linha3Endereco?: string;
  vinculo: string;
  cpfCnpj: string;
  situacao: string;
}

interface ListaCadastrosResponse {
  mensagens?: string[];
  cadastros: CadastroApiItem[];
}

function montarEndereco(item: CadastroApiItem): string {
  return [item.linha1Endereco, item.linha2Endereco, item.linha3Endereco]
    .map((linha) => linha?.trim())
    .filter(Boolean)
    .join(', ');
}

function mapearCadastro(item: CadastroApiItem): Cadastro {
  const cpfCnpj = item.cpfCnpj?.trim();
  const inscricaoMunicipal = item.chave?.trim();

  return {
    id: String(item.id),
    cadastro: item.tipoCadastroPortal,
    cpfCnpj: cpfCnpj ? cpfCnpj : null,
    inscricaoMunicipal: inscricaoMunicipal ?? '',
    nomeRazaoSocial: item.nome,
    endereco: montarEndereco(item),
    vinculoCadastral: item.vinculo,
    situacao: item.situacao,
  };
}

export async function listarCadastrosPorCpfCnpj(
  cpfCnpj: string,
): Promise<Cadastro[]> {
  try {
    const { data } = await internalApiClient.get<ListaCadastrosResponse>(
      '/cadastro/lista',
      { params: { cpfCnpjLogado: cpfCnpj } },
    );

    if (data.mensagens?.length) {
      throw new Error(data.mensagens.join(' '));
    }

    return (data.cadastros ?? []).map(mapearCadastro);
  } catch (error) {
    if (
      axios.isAxiosError<ListaCadastrosResponse>(error) &&
      error.response?.data?.mensagens?.length
    ) {
      throw new Error(error.response.data.mensagens.join(' '));
    }

    throw error;
  }
}
