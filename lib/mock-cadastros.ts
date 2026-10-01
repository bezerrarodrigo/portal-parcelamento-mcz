// Dados mockados para o protótipo da tela de seleção de cadastro.
// Futuramente devem ser substituídos pela resposta de uma API REST.

export interface Cadastro {
  id: string;
  cadastro: 'Imóvel' | 'Empresa' | 'Pessoa';
  cpfCnpj: string | null;
  inscricaoMunicipal: string;
  nomeRazaoSocial: string;
  endereco: string;
  vinculoCadastral: string;
  situacao: 'Ativo' | 'Inativo';
}

export const tiposCadastro = ['Imóvel', 'Empresa', 'Pessoa'] as const;

const cadastrosMock: Cadastro[] = [
  {
    id: 'c1',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0119020100010001',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco:
      'RUA P.B.STA LUZIA, 111, CONDOMINIO:CONDOMINIO JM COMERCIO; PRÓXIMO SANTA LUZIA CAMPO GRANDE/MS 79.000-001',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c2',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0119020100010002',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco:
      'RUA P.B.STA LUZIA, 111, CONDOMINIO: CONDOMINIO JM COMERCIO PRÓXIMO SANTA LUZIA CAMPO GRANDE/MS 79.000-001',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c3',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0119020100010003',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco:
      'RUA P.B.STA LUZIA, 111, CONDOMINIO: CONDOMINIO JM COMERCIO PRÓXIMO SANTA LUZIA CAMPO GRANDE/MS 79.000-001',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c4',
    cadastro: 'Imóvel',
    cpfCnpj: '125.228.346-65',
    inscricaoMunicipal: '0128010100300001',
    nomeRazaoSocial: 'DSF DESENV',
    endereco:
      'RUA SANTA MONICA, 43, FUNDOS:123;SALA:48; BAIRRO SANTA LUZIA CAMPO GRANDE/MS 79.000-001',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c5',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0128050300490001',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco:
      'RUA SANTA ROSA, 554, CONDOMINIO: CONDOMINIO JM COMERCIO BAIRRO SANTA LUZIA QD: 00058 LT: 00015 CAMPO GRANDE/MS',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c6',
    cadastro: 'Imóvel',
    cpfCnpj: null,
    inscricaoMunicipal: '0128080300370001',
    nomeRazaoSocial: 'MARIA GONCALVES SANCHES',
    endereco:
      'RUA SANTA GERTRUDES, 1035, CASA:MIRRADA; BAIRRO SANTA LUZIA QD: 00033 LT: 00014 CAMPO GRANDE/MS',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c7',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0138050100010001',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco:
      'RUA SANTO ANASTACIO, 32, BANCA:ABERTA; BAIRRO SANTA LUZIA CAMPO GRANDE/MS 79.000-001',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c8',
    cadastro: 'Empresa',
    cpfCnpj: '03.501.509/0001-06',
    inscricaoMunicipal: '0138190200370001',
    nomeRazaoSocial: 'MUNICIPIO DE CAMPO GRANDE',
    endereco: 'RUA SAO GREGORIO VILA COX QD: 00008 LT: 00008 CAMPO GRANDE/MS',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c9',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0144110100010003',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco:
      'RUA MURILO LAGRECA, 414 NÚCLEO JOSE ABRAO QD: 00011 LT: 00001 CAMPO GRANDE/MS',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c10',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0144110109000001',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco:
      'RUA MARCO FERREZ, 554 NÚCLEO JOSE ABRAO CAMPO GRANDE/MS 79.000-001',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c11',
    cadastro: 'Imóvel',
    cpfCnpj: '778.778.778-38',
    inscricaoMunicipal: '0144110109000002',
    nomeRazaoSocial: 'DSF GESTAO TESTANDO 123',
    endereco: 'RUA MURILO LAGRECA, 554 NÚCLEO JOSE ABRAO CAMPO GRANDE/MS',
    vinculoCadastral: 'Proprietário',
    situacao: 'Ativo',
  },
  {
    id: 'c12',
    cadastro: 'Empresa',
    cpfCnpj: '03.732.914/0001-35',
    inscricaoMunicipal: '0410120101110001',
    nomeRazaoSocial: 'COMUNIDADE EVANGELICA DE CONFISSAO LUTERANA',
    endereco:
      'RUA DA CALAMA, 118 LOTEAMENTO MUNIC JARDIM PANTANAL QD: 00003 LT: 00021 CAMPO GRANDE/MS 79.000-001',
    vinculoCadastral: 'Socio-administrador',
    situacao: 'Ativo',
  },
];

export function getCadastros(): Cadastro[] {
  return cadastrosMock;
}

interface FiltroCadastros {
  cadastro?: string;
  texto?: string;
}

export function filtrarCadastros({
  cadastro,
  texto,
}: FiltroCadastros): Cadastro[] {
  const termo = texto?.trim().toLowerCase() ?? '';

  return cadastrosMock.filter((item) => {
    const combinaCadastro = !cadastro || item.cadastro === cadastro;
    const combinaTexto =
      !termo ||
      item.nomeRazaoSocial.toLowerCase().includes(termo) ||
      item.inscricaoMunicipal.toLowerCase().includes(termo) ||
      (item.cpfCnpj?.toLowerCase().includes(termo) ?? false);

    return combinaCadastro && combinaTexto;
  });
}
