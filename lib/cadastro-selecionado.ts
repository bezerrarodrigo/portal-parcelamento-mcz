import type { Cadastro } from '@/lib/mock-cadastros';

const CHAVE_CADASTRO_SELECIONADO = 'siat-mcz:cadastro-selecionado';

export function salvarCadastroSelecionado(cadastro: Cadastro): void {
  sessionStorage.setItem(
    CHAVE_CADASTRO_SELECIONADO,
    JSON.stringify(cadastro),
  );
}

export function obterValorCadastroSelecionado(): string | null {
  return sessionStorage.getItem(CHAVE_CADASTRO_SELECIONADO);
}

export function interpretarCadastroSelecionado(
  valor: string | null,
): Cadastro | null {
  if (!valor) return null;

  try {
    const cadastro: unknown = JSON.parse(valor);

    if (!ehCadastro(cadastro)) {
      console.error('Os dados do cadastro selecionado são inválidos.');
      return null;
    }

    return cadastro;
  } catch (error) {
    console.error('Não foi possível ler o cadastro selecionado.', error);
    return null;
  }
}

function ehCadastro(valor: unknown): valor is Cadastro {
  if (typeof valor !== 'object' || valor === null) return false;

  const cadastro = valor as Record<string, unknown>;

  return (
    typeof cadastro.id === 'string' &&
    (cadastro.cadastro === 'Imóvel' ||
      cadastro.cadastro === 'Empresa' ||
      cadastro.cadastro === 'Pessoa') &&
    (typeof cadastro.cpfCnpj === 'string' || cadastro.cpfCnpj === null) &&
    typeof cadastro.inscricaoMunicipal === 'string' &&
    typeof cadastro.nomeRazaoSocial === 'string' &&
    typeof cadastro.endereco === 'string' &&
    typeof cadastro.vinculoCadastral === 'string' &&
    typeof cadastro.situacao === 'string'
  );
}
