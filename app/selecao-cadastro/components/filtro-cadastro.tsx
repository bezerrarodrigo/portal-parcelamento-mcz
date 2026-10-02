'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { tiposCadastro } from '@/lib/mock-cadastros';
import { Search } from 'lucide-react';

const TODOS = 'todos';

interface FiltroCadastroProps {
  cadastro: string;
  texto: string;
  onCadastroChange: (cadastro: string) => void;
  onTextoChange: (texto: string) => void;
  onPesquisar: () => void;
}

export default function FiltroCadastro({
  cadastro,
  texto,
  onCadastroChange,
  onTextoChange,
  onPesquisar,
}: FiltroCadastroProps) {
  return (
    <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
      <Select value={cadastro} onValueChange={onCadastroChange}>
        <SelectTrigger className='w-full md:w-44'>
          <SelectValue placeholder='Cadastro' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Cadastro</SelectItem>
          {tiposCadastro.map((tipo) => (
            <SelectItem key={tipo} value={tipo}>
              {tipo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={texto}
        onChange={(event) => onTextoChange(event.target.value)}
        placeholder='CPF/CNPJ, inscrição ou nome'
        className='w-full md:flex-1'
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onPesquisar();
          }
        }}
      />

      <Button
        type='button'
        onClick={onPesquisar}
        className='w-full gap-2 md:w-auto'
      >
        <Search size={16} />
        Pesquisar
      </Button>
    </div>
  );
}

export { TODOS };
