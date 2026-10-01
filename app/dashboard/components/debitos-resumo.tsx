'use client';

import { useState } from 'react';
import { Pie, PieChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/formatters';

interface DebitosResumoProps {
  vencidos: number;
  aVencer: number;
  total: number;
}

const chartConfig = {
  valor: { label: 'Valor' },
  vencidos: { label: 'Vencidos', color: '#e97832' },
  aVencer: { label: 'A vencer', color: '#075985' },
} satisfies ChartConfig;

export default function DebitosResumo({
  vencidos,
  aVencer,
  total,
}: DebitosResumoProps) {
  const [visivel, setVisivel] = useState(true);

  const dados = [
    { situacao: 'vencidos', valor: vencidos, fill: chartConfig.vencidos.color },
    { situacao: 'aVencer', valor: aVencer, fill: chartConfig.aVencer.color },
  ].filter((item) => item.valor > 0);

  return (
    <section className='border border-line bg-white'>
      <header className='flex items-center justify-between bg-gray-100 px-4 py-2.5'>
        <h2 className='m-0 text-[0.86rem] font-bold text-ink'>Débitos</h2>
        <button
          type='button'
          onClick={() => setVisivel((atual) => !atual)}
          className='text-[0.8rem] font-semibold text-blue hover:text-orange'
        >
          {visivel ? 'Ocultar' : 'Mostrar'}
        </button>
      </header>

      {visivel && (
        <div className='flex flex-col gap-6 p-4 md:flex-row md:items-center'>
          <div className='w-full shrink-0 border-l-4 border-orange md:w-56'>
            <div className='flex items-center justify-between border-b border-orange/40 px-3 py-2 text-[0.86rem]'>
              <span>Vencidos:</span>
              <span className='font-semibold'>{formatCurrency(vencidos)}</span>
            </div>
            <div className='flex items-center justify-between border-b border-orange/40 px-3 py-2 text-[0.86rem]'>
              <span>A vencer:</span>
              <span className='font-semibold'>{formatCurrency(aVencer)}</span>
            </div>
            <div className='flex items-center justify-between bg-gray-50 px-3 py-2 text-[0.86rem] font-semibold'>
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {dados.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className='mx-auto aspect-square max-h-80 w-full'
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={dados}
                  dataKey='valor'
                  nameKey='situacao'
                  label={(entry) => {
                    const payload = entry.payload as {
                      situacao: string;
                      valor: number;
                    };
                    return `${chartConfig[payload.situacao as keyof typeof chartConfig].label} ${Math.round((payload.valor / total) * 100)}%`;
                  }}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <p className='text-[0.82rem] text-ink-soft'>
              Nenhum débito encontrado.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
