// Cálculo mock/simplificado da simulação de parcelamento — apenas para fins
// visuais deste protótipo. Não reflete regra de negócio real.

export interface SimulacaoInput {
  valorLancadoSelecionado: number;
  valorAtualizadoSelecionado: number;
  quantidadeParcelas: number;
  valorEntrada: number;
}

export interface SimulacaoResultado {
  descontoPercentLancado: number;
  descontoPercentAtualizado: number;
  valorDescontoLancado: number;
  valorDescontoAtualizado: number;
  valorAParcelarLancado: number;
  valorAParcelarAtualizado: number;
  primeiraParcela: number;
  demaisParcelas: number;
}

const DESCONTO_MAXIMO_ATUALIZADO = 15;
const DESCONTO_MINIMO_ATUALIZADO = 0;
const REDUCAO_POR_PARCELA = 1.5;
const PROPORCAO_DESCONTO_LANCADO = 4 / 15;

export function simularParcelamento({
  valorLancadoSelecionado,
  valorAtualizadoSelecionado,
  quantidadeParcelas,
  valorEntrada,
}: SimulacaoInput): SimulacaoResultado {
  const parcelas = Math.max(1, quantidadeParcelas);

  const descontoPercentAtualizado = Math.min(
    DESCONTO_MAXIMO_ATUALIZADO,
    Math.max(
      DESCONTO_MINIMO_ATUALIZADO,
      DESCONTO_MAXIMO_ATUALIZADO - (parcelas - 1) * REDUCAO_POR_PARCELA,
    ),
  );
  const descontoPercentLancado =
    descontoPercentAtualizado * PROPORCAO_DESCONTO_LANCADO;

  const valorDescontoLancado =
    valorLancadoSelecionado * (descontoPercentLancado / 100);
  const valorDescontoAtualizado =
    valorAtualizadoSelecionado * (descontoPercentAtualizado / 100);

  const valorAParcelarLancado = valorLancadoSelecionado - valorDescontoLancado;
  const valorAParcelarAtualizado = Math.max(
    0,
    valorAtualizadoSelecionado - valorDescontoAtualizado - valorEntrada,
  );

  const valorParcela = valorAParcelarAtualizado / parcelas;
  const primeiraParcela = valorParcela;
  const demaisParcelas = parcelas > 1 ? valorParcela : 0;

  return {
    descontoPercentLancado,
    descontoPercentAtualizado,
    valorDescontoLancado,
    valorDescontoAtualizado,
    valorAParcelarLancado,
    valorAParcelarAtualizado,
    primeiraParcela,
    demaisParcelas,
  };
}
