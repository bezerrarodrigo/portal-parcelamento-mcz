'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface FiltroDebitosProps {
  tributos: string[];
  exercicios: number[];
  tributosSelecionados: string[];
  exerciciosSelecionados: string[];
  vencimentoSelecionado: DateRange;
  onTributoChange: (tributos: string[]) => void;
  onExercicioChange: (exercicios: string[]) => void;
  onVencimentoChange: (vencimento: DateRange) => void;
  onPesquisar: () => void;
}

const TODOS = 'todos';

export interface DateRange {
  from?: string;
  to?: string;
}

export default function FiltroDebitos({
  tributos,
  exercicios,
  tributosSelecionados,
  exerciciosSelecionados,
  vencimentoSelecionado,
  onTributoChange,
  onExercicioChange,
  onVencimentoChange,
  onPesquisar,
}: FiltroDebitosProps) {
  return (
    <div>
      <h2 className='mb-2 text-[1.25rem] font-bold text-ink'>
        Filtro de débitos
      </h2>
      <div className='grid grid-cols-1 gap-4 border border-line bg-white p-5 md:grid-cols-2'>
        <div className='grid gap-1.5'>
          <label
            htmlFor='filtro-tributo'
            className='text-[0.76rem] font-extrabold text-ink'
          >
            Tributo
          </label>
          <FiltroMultiplo
            id='filtro-tributo'
            opcoes={tributos}
            selecionados={tributosSelecionados}
            todosLabel='Todos os tributos'
            onChange={onTributoChange}
          />
        </div>
        <div className='grid gap-1.5'>
          <label
            htmlFor='filtro-exercicio'
            className='text-[0.76rem] font-extrabold text-ink'
          >
            Período (exercício)
          </label>
          <FiltroMultiplo
            id='filtro-exercicio'
            opcoes={exercicios.map(String)}
            selecionados={exerciciosSelecionados}
            todosLabel='Todos os períodos'
            onChange={onExercicioChange}
          />
        </div>
        <div className='grid gap-1.5'>
          <label
            htmlFor='filtro-vencimento-inicio'
            className='text-[0.76rem] font-extrabold text-ink'
          >
            Vencimento
          </label>
          <DateRangePicker
            value={vencimentoSelecionado}
            onChange={onVencimentoChange}
          />
        </div>
        <div className='md:col-span-2 md:flex md:justify-end'>
          <Button
            type='button'
            onClick={onPesquisar}
            className='w-full md:w-auto'
          >
            Pesquisar
          </Button>
        </div>
      </div>
    </div>
  );
}

export { TODOS };

interface FiltroMultiploProps {
  id: string;
  opcoes: string[];
  selecionados: string[];
  todosLabel: string;
  onChange: (valores: string[]) => void;
}

function FiltroMultiplo({
  id,
  opcoes,
  selecionados,
  todosLabel,
  onChange,
}: FiltroMultiploProps) {
  const [aberto, setAberto] = useState(false);
  const todosSelecionados = selecionados.includes(TODOS);
  const resumo = todosSelecionados
    ? todosLabel
    : selecionados.length > 0
      ? selecionados.join(', ')
      : todosLabel;

  function alternar(valor: string) {
    if (valor === TODOS) {
      onChange([TODOS]);
      return;
    }

    const valores = selecionados.filter((item) => item !== TODOS);
    const novosValores = valores.includes(valor)
      ? valores.filter((item) => item !== valor)
      : [...valores, valor];
    onChange(novosValores.length > 0 ? novosValores : [TODOS]);
  }

  return (
    <div className='relative'>
      <button
        id={id}
        type='button'
        aria-expanded={aberto}
        onClick={() => setAberto((atual) => !atual)}
        className='flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-2.5 text-left text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
      >
        <span className='truncate'>{resumo}</span>
        <span aria-hidden='true'>⌄</span>
      </button>
      {aberto && (
        <div className='absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10'>
          <label className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent'>
            <Checkbox
              checked={todosSelecionados}
              onCheckedChange={() => alternar(TODOS)}
            />
            {todosLabel}
          </label>
          {opcoes.map((opcao) => (
            <label
              key={opcao}
              className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent'
            >
              <Checkbox
                checked={selecionados.includes(opcao)}
                onCheckedChange={() => alternar(opcao)}
              />
              {opcao}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className='grid grid-cols-2 gap-2'>
      <input
        id='filtro-vencimento-inicio'
        type='date'
        aria-label='Vencimento inicial'
        value={value.from ?? ''}
        onChange={(event) =>
          onChange({ ...value, from: event.target.value || undefined })
        }
        className='h-9 min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
      />
      <input
        type='date'
        aria-label='Vencimento final'
        value={value.to ?? ''}
        min={value.from}
        onChange={(event) =>
          onChange({ ...value, to: event.target.value || undefined })
        }
        className='h-9 min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
      />
    </div>
  );
}
