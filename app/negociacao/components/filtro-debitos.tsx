'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FiltroDebitosProps {
  tributos: string[];
  exercicios: number[];
  tributoSelecionado: string;
  exercicioSelecionado: string;
  onTributoChange: (tributo: string) => void;
  onExercicioChange: (exercicio: string) => void;
  onPesquisar: () => void;
}

const TODOS = 'todos';

export default function FiltroDebitos({
  tributos,
  exercicios,
  tributoSelecionado,
  exercicioSelecionado,
  onTributoChange,
  onExercicioChange,
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
          <Select value={tributoSelecionado} onValueChange={onTributoChange}>
            <SelectTrigger id='filtro-tributo' className='w-full'>
              <SelectValue placeholder='Todos os tributos' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos os tributos</SelectItem>
              {tributos.map((tributo) => (
                <SelectItem key={tributo} value={tributo}>
                  {tributo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='grid gap-1.5'>
          <label
            htmlFor='filtro-exercicio'
            className='text-[0.76rem] font-extrabold text-ink'
          >
            Período (exercício)
          </label>
          <Select
            value={exercicioSelecionado}
            onValueChange={onExercicioChange}
          >
            <SelectTrigger id='filtro-exercicio' className='w-full'>
              <SelectValue placeholder='Todos os períodos' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos os períodos</SelectItem>
              {exercicios.map((exercicio) => (
                <SelectItem key={exercicio} value={String(exercicio)}>
                  {exercicio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
