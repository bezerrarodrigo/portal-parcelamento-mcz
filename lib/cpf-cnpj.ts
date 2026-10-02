export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function isSequenciaRepetida(value: string): boolean {
  return value.split('').every((digito) => digito === value[0]);
}

export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11 || isSequenciaRepetida(cpf)) return false;

  const calcularDigito = (tamanho: number) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return (
    calcularDigito(9) === Number(cpf[9]) &&
    calcularDigito(10) === Number(cpf[10])
  );
}

export function isValidCNPJ(value: string): boolean {
  const cnpj = onlyDigits(value);

  if (cnpj.length !== 14 || isSequenciaRepetida(cnpj)) return false;

  const calcularDigito = (tamanho: number) => {
    const pesos =
      tamanho === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce(
      (acumulado, peso, index) => acumulado + peso * Number(cnpj[index]),
      0,
    );
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return (
    calcularDigito(12) === Number(cnpj[12]) &&
    calcularDigito(13) === Number(cnpj[13])
  );
}

export function isValidCpfCnpj(value: string): boolean {
  const digitos = onlyDigits(value);
  return isValidCPF(digitos) || isValidCNPJ(digitos);
}
