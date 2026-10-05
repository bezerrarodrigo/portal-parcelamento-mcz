const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export type ResultadoValidacao =
  { erro: string } | { erro?: undefined; corpo: Record<string, unknown> };

// Valida e monta o corpo ParcelamentoDadosSimulacaoRS enviado ao SIAT.
export function validarDadosSimulacao(entrada: unknown): ResultadoValidacao {
  if (!entrada || typeof entrada !== 'object') {
    return { erro: 'O corpo da requisição é inválido.' };
  }

  const dados = entrada as Record<string, unknown>;
  const regra = dados.regraParcelamento as Record<string, unknown> | undefined;
  const quantidade = dados.quantidadeParcelasParcelamento;
  const parcelas = dados.parcelasCalculadas;

  if (typeof dados.aVista !== 'boolean') {
    return { erro: 'Informe se o parcelamento é à vista.' };
  }
  if (!Number.isInteger(quantidade) || (quantidade as number) < 1) {
    return { erro: 'Informe uma quantidade de parcelas válida.' };
  }
  if (
    typeof dados.dataContrato !== 'string' ||
    typeof dados.dataCalculo !== 'string' ||
    !DATA_REGEX.test(dados.dataContrato) ||
    !DATA_REGEX.test(dados.dataCalculo)
  ) {
    return { erro: 'Informe datas válidas no formato AAAA-MM-DD.' };
  }
  if (!regra || typeof regra.id !== 'number') {
    return { erro: 'Informe a regra de parcelamento.' };
  }
  if (!Array.isArray(parcelas) || parcelas.length === 0) {
    return { erro: 'Selecione ao menos um débito.' };
  }
  if (
    typeof dados.valorEntrada !== 'number' ||
    !Number.isFinite(dados.valorEntrada) ||
    dados.valorEntrada < 0
  ) {
    return { erro: 'Informe um valor de entrada válido.' };
  }

  return {
    corpo: {
      aVista: dados.aVista,
      valorEntrada: dados.valorEntrada,
      percentualEntrada: dados.percentualEntrada ?? null,
      dataContrato: dados.dataContrato,
      dataCalculo: dados.dataCalculo,
      quantidadeParcelasParcelamento: quantidade,
      regraParcelamento: regra,
      parcelasCalculadas: parcelas,
    },
  };
}
