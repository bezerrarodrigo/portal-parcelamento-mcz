'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FiltroDebitosProps {
  tributos: string[];
  exercicios: number[];
  tributoSelecionado: string;
  exercicioSelecionado: string;
  onTributoChange: (tributo: string) => void;
  onExercicioChange: (exercicio: string) => void;
}

const TODOS = 'todos';

export default function FiltroDebitos({
  tributos,
  exercicios,
  tributoSelecionado,
  exercicioSelecionado,
  onTributoChange,
  onExercicioChange,
}: FiltroDebitosProps) {
  return (
    <div className='debitos-toolbar'>
      <div className='form-field'>
        <label htmlFor='filtro-tributo'>Tributo</label>
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
      <div className='form-field'>
        <label htmlFor='filtro-exercicio'>Período (exercício)</label>
        <Select value={exercicioSelecionado} onValueChange={onExercicioChange}>
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
    </div>
  );
}

export { TODOS };
