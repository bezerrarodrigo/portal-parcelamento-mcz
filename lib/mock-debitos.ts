// Dados mockados para o protótipo da tela de relação de débitos/parcelamento.
// Futuramente devem ser substituídos pela resposta de uma API REST.

export interface Debito {
  id: string;
  tributo: string;
  exercicio: number;
  parcela: number;
  codLacto: string;
  vencimento: string;
  valorLancado: number;
  valorAtualizado: number;
  jurosMultaDesconto: number;
  total: number;
  atrasoDias: number | null;
  situacao: string;
  numeroAutoInfracao: string | null;
}

export interface DividaNaoParcelavel {
  id: string;
  descricao: string;
  valor: number;
}

const debitosMock: Debito[] = [
  {
    id: 'd1',
    tributo: 'PARC ECON FINANCIADO PAD',
    exercicio: 2023,
    parcela: 45,
    codLacto: '21029823',
    vencimento: '2026-10-03',
    valorLancado: 3864.53,
    valorAtualizado: 6407.53,
    jurosMultaDesconto: 1957.85,
    total: 6407.53,
    atrasoDias: null,
    situacao: 'O',
    numeroAutoInfracao: null,
  },
  {
    id: 'd2',
    tributo: 'PARC ECON FINANCIADO PAD',
    exercicio: 2023,
    parcela: 46,
    codLacto: '21029823',
    vencimento: '2026-11-03',
    valorLancado: 3864.53,
    valorAtualizado: 6407.53,
    jurosMultaDesconto: 1957.85,
    total: 6407.53,
    atrasoDias: null,
    situacao: 'O',
    numeroAutoInfracao: null,
  },
  {
    id: 'd3',
    tributo: 'PARC ECON FINANCIADO PAD',
    exercicio: 2023,
    parcela: 47,
    codLacto: '21029823',
    vencimento: '2026-12-03',
    valorLancado: 3864.53,
    valorAtualizado: 6407.53,
    jurosMultaDesconto: 1957.85,
    total: 6407.53,
    atrasoDias: null,
    situacao: 'O',
    numeroAutoInfracao: null,
  },
  {
    id: 'd4',
    tributo: 'PARC ECON FINANCIADO PAD',
    exercicio: 2023,
    parcela: 48,
    codLacto: '21029823',
    vencimento: '2027-01-03',
    valorLancado: 3864.53,
    valorAtualizado: 6407.53,
    jurosMultaDesconto: 1957.85,
    total: 6407.53,
    atrasoDias: null,
    situacao: 'O',
    numeroAutoInfracao: null,
  },
];

const dividasNaoParcelaveisMock: DividaNaoParcelavel[] = [
  {
    id: 'np1',
    descricao: 'Débito em discussão judicial',
    valor: 389.82,
  },
];

const legendaSituacoes: Record<string, string> = {
  S: 'Débito Suspenso',
  R: 'Prescrita tributária',
  N: 'Prescrita não tributária',
  '#': 'Desistência execução fiscal',
  W: 'Débito Protesto Suspenso',
  X: 'Débito Negativado',
  O: 'Débito de Anos Anteriores',
  '*': 'Débito Ativa CDA',
  P: 'Débito Parcelado',
  A: 'Débito Ativa Dívida Ativa',
  C: 'Débito Cobrança',
  E: 'Débito Ajuiz Exec Manual',
  T: 'Débito Protestado',
  D: 'Débito Ajuiz Exec Digital',
  Z: 'Débito Encaminhado a Protesto',
};

// Em um cenário real, a busca seria feita por API a partir da inscrição informada.
export function getDebitosPorInscricao(_inscricao: string): Debito[] {
  return debitosMock;
}

export function getDividasNaoParcelaveis(): DividaNaoParcelavel[] {
  return dividasNaoParcelaveisMock;
}

export function getLegendaSituacoes(): Record<string, string> {
  return legendaSituacoes;
}
