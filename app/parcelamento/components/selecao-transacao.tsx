'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/formatters';
import type { OpcaoParcelamento } from '@/lib/api/parcelamentos';

interface SelecaoTransacaoProps {
  cadastro: string;
  idCadastro: string;
  inscricao?: string;
  opcoes: OpcaoParcelamento[];
}

export default function SelecaoTransacao({
  cadastro,
  idCadastro,
  inscricao,
  opcoes,
}: SelecaoTransacaoProps) {
  const router = useRouter();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(
    () => opcoes.find((opcao) => opcao.mode === 'parcelado')?.id ?? opcoes[0].id,
  );
  const [detalhesVisiveis, setDetalhesVisiveis] = useState<string | null>(null);

  function avancar() {
    const opcao = opcoes.find((item) => item.id === opcaoSelecionada);
    if (!opcao) return;

    const params = new URLSearchParams({
      cadastro,
      id: idCadastro,
      regraId: opcao.id,
    });
    if (opcao.mode) {
      params.set('mode', opcao.mode);
    }
    if (inscricao) {
      params.set('inscricao', inscricao);
    }

    router.push(`/negociacao?${params.toString()}`);
  }

  return (
    <div className='mt-8'>
      <div role='group' aria-label='Opções de transação' className='grid gap-5'>
        {opcoes.map((opcao, index) => {
          const selecionada = opcaoSelecionada === opcao.id;
          const detalhesAbertos = detalhesVisiveis === opcao.id;
          const descricao = `${index + 1} - ${opcao.nome}`;

          return (
            <section
              key={opcao.id}
              className='overflow-hidden rounded-md border border-line bg-white shadow-sm'
            >
              <label className='flex min-h-16 cursor-pointer items-center gap-3 px-5 py-4 text-sm font-semibold text-ink'>
                <Checkbox
                  checked={selecionada}
                  onCheckedChange={() => setOpcaoSelecionada(opcao.id)}
                  aria-label={`Selecionar ${descricao}`}
                />
                <span>{descricao}</span>
              </label>

              <div className='overflow-x-auto px-5 pb-5'>
                <table className='w-full min-w-[690px] border-collapse text-right text-xs'>
                  <thead>
                    <tr className='bg-slate-100 text-ink-soft'>
                      <th className='border border-line px-2 py-2 text-left font-semibold' />
                      <th className='border border-line px-3 py-2 font-semibold'>
                        Vlr Lançado
                      </th>
                      <th className='border border-line px-3 py-2 font-semibold'>
                        Vlr Atualizado
                      </th>
                      <th className='border border-line px-3 py-2 font-semibold'>
                        Jur/Mult/Desc
                      </th>
                      <th className='border border-line px-3 py-2 font-semibold'>
                        Honorário
                      </th>
                      <th className='border border-line px-3 py-2 font-semibold'>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='bg-slate-50 text-ink'>
                      <td className='border border-line px-2 py-2 text-left'>
                        <span>Total dívida(s) para parcelamento normal: </span>
                        <button
                          type='button'
                          aria-expanded={detalhesAbertos}
                          onClick={() =>
                            setDetalhesVisiveis(
                              detalhesAbertos ? null : opcao.id,
                            )
                          }
                          className='font-medium text-blue underline underline-offset-2 hover:text-blue-deep'
                        >
                          {detalhesAbertos ? 'Ocultar' : 'Visualizar'}
                        </button>
                      </td>
                      <td className='border border-line px-3 py-2'>
                        {formatCurrency(opcao.valores.lancado)}
                      </td>
                      <td className='border border-line px-3 py-2'>
                        {formatCurrency(opcao.valores.atualizado)}
                      </td>
                      <td className='border border-line px-3 py-2'>
                        {formatCurrency(opcao.valores.jurosMultaDesconto)}
                      </td>
                      <td className='border border-line px-3 py-2'>
                        {formatCurrency(opcao.valores.honorario)}
                      </td>
                      <td className='border border-line px-3 py-2'>
                        {formatCurrency(opcao.valores.total)}
                      </td>
                    </tr>
                    {detalhesAbertos && (
                      <tr>
                        <td
                          colSpan={6}
                          className='border border-line bg-white px-3 py-3 text-left text-ink-soft'
                        >
                          <div className='overflow-x-auto'>
                            <table className='w-full min-w-[760px] border-collapse text-right'>
                              <thead className='bg-slate-100 text-ink-soft'>
                                <tr>
                                  <th className='border border-line px-2 py-2 text-left font-semibold'>
                                    Débito
                                  </th>
                                  <th className='border border-line px-2 py-2 font-semibold'>
                                    Parcela
                                  </th>
                                  <th className='border border-line px-2 py-2 font-semibold'>
                                    Vlr Lançado
                                  </th>
                                  <th className='border border-line px-2 py-2 font-semibold'>
                                    Vlr Atualizado
                                  </th>
                                  <th className='border border-line px-2 py-2 font-semibold'>
                                    Jur/Mult/Desc
                                  </th>
                                  <th className='border border-line px-2 py-2 font-semibold'>
                                    Honorário
                                  </th>
                                  <th className='border border-line px-2 py-2 font-semibold'>
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {opcao.parcelas.map((parcela) => (
                                  <tr key={parcela.id} className='text-ink'>
                                    <td className='border border-line px-2 py-2 text-left'>
                                      {parcela.tributo}
                                    </td>
                                    <td className='border border-line px-2 py-2'>
                                      {parcela.parcela}
                                    </td>
                                    <td className='border border-line px-2 py-2'>
                                      {formatCurrency(parcela.valorLancado)}
                                    </td>
                                    <td className='border border-line px-2 py-2'>
                                      {formatCurrency(parcela.valorAtualizado)}
                                    </td>
                                    <td className='border border-line px-2 py-2'>
                                      {formatCurrency(parcela.jurosMultaDesconto)}
                                    </td>
                                    <td className='border border-line px-2 py-2'>
                                      {formatCurrency(parcela.honorario ?? 0)}
                                    </td>
                                    <td className='border border-line px-2 py-2'>
                                      {formatCurrency(parcela.total)}
                                    </td>
                                  </tr>
                                ))}
                                {opcao.parcelas.length === 0 && (
                                  <tr>
                                    <td
                                      colSpan={7}
                                      className='border border-line px-2 py-3 text-center'
                                    >
                                      Nenhum débito permitido nesta regra.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>

      <div className='mt-7 flex items-center gap-3 border-t border-line pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
          className='border-blue text-blue hover:bg-blue/5 hover:text-blue-deep'
        >
          Voltar
        </Button>
        <Button
          type='button'
          onClick={avancar}
          className='bg-blue px-6 text-white hover:bg-blue-deep'
        >
          Avançar
        </Button>
      </div>
    </div>
  );
}
