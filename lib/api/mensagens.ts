export function normalizarMensagens(mensagens: unknown): string[] {
  if (!Array.isArray(mensagens)) return [];

  return mensagens.flatMap((mensagem) => {
    if (typeof mensagem === 'string') return [mensagem];
    if (
      mensagem &&
      typeof mensagem === 'object' &&
      'mensagemDescricao' in mensagem &&
      typeof mensagem.mensagemDescricao === 'string'
    ) {
      return [mensagem.mensagemDescricao];
    }

    return [];
  });
}
