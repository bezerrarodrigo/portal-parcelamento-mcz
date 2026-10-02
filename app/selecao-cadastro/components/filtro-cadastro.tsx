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
import { Loader2, Search } from 'lucide-react';

const TODOS = 'todos';

interface FiltroCadastroProps {
  cadastro: string;
  texto: string;
  carregando?: boolean;
  onCadastroChange: (cadastro: string) => void;
  onTextoChange: (texto: string) => void;
  onPesquisar: () => void;
}

export default function FiltroCadastro({
  cadastro,
  texto,
  carregando = false,
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
        placeholder='CPF/CNPJ'
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
        disabled={carregando}
        className='w-full gap-2 md:w-auto'
      >
        {carregando ? (
          <Loader2 size={16} className='animate-spin' />
        ) : (
          <Search size={16} />
        )}
        {carregando ? 'Pesquisando...' : 'Pesquisar'}
      </Button>
    </div>
  );
}

export { TODOS };
