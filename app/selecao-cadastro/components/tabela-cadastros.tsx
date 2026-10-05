'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { Cadastro } from '@/lib/mock-cadastros';
import CardCadastro from './card-cadastro';

interface TabelaCadastrosProps {
  cadastros: Cadastro[];
  carregando?: boolean;
  selecionado: string | null;
  onSelecionar: (id: string) => void;
}

export default function TabelaCadastros({
  cadastros,
  carregando = false,
  selecionado,
  onSelecionar,
}: TabelaCadastrosProps) {
  if (carregando) {
    return <TabelaCadastrosSkeleton />;
  }

  const mensagemVazio =
    'Nenhum cadastro encontrado para os filtros selecionados.';

  return (
    <>
      <div className='flex flex-col gap-3 md:hidden'>
        {cadastros.map((item) => (
          <CardCadastro
            key={item.id}
            cadastro={item}
            selecionado={selecionado === item.id}
            onSelecionar={onSelecionar}
          />
        ))}
        {cadastros.length === 0 && (
          <p className='border border-line bg-white p-4 text-center text-ink-soft'>
            {mensagemVazio}
          </p>
        )}
      </div>

      <div className='hidden border border-line bg-white md:block'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-10 text-center'>Selecione</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Insc. municipal</TableHead>
                <TableHead>Nome/Razão social</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Vínculo cadastral</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cadastros.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='text-center'>
                    <input
                      type='radio'
                      name='cadastro-selecionado-desktop'
                      checked={selecionado === item.id}
                      onChange={() => onSelecionar(item.id)}
                      aria-label={`Selecionar cadastro ${item.nomeRazaoSocial}`}
                      className='size-4 accent-blue'
                    />
                  </TableCell>
                  <TableCell>{item.cadastro}</TableCell>
                  <TableCell>{item.cpfCnpj ?? '-'}</TableCell>
                  <TableCell className='whitespace-normal'>
                    {item.inscricaoMunicipal}
                  </TableCell>
                  <TableCell className='whitespace-normal'>
                    {item.nomeRazaoSocial}
                  </TableCell>
                  <TableCell className='min-w-lg whitespace-normal'>
                    {item.endereco}
                  </TableCell>
                  <TableCell>{item.vinculoCadastral}</TableCell>
                  <TableCell>{item.situacao}</TableCell>
                </TableRow>
              ))}
              {cadastros.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className='text-center text-ink-soft'>
                    {mensagemVazio}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

export function TabelaCadastrosSkeleton() {
  return (
    <div
      role='status'
      aria-label='Carregando cadastros'
      className='grid gap-3'
    >
      <div aria-hidden='true' className='flex flex-col gap-3 md:hidden'>
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className='rounded-md border border-line bg-white p-4'
          >
            <div className='mb-4 flex items-center gap-3'>
              <Skeleton className='size-4 rounded-full' />
              <Skeleton className='h-4 w-36' />
            </div>
            <div className='grid gap-3'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
              <Skeleton className='h-4 w-2/3' />
            </div>
          </div>
        ))}
      </div>

      <div
        aria-hidden='true'
        className='hidden border border-line bg-white md:block'
      >
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-10 text-center'>Selecione</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Insc. municipal</TableHead>
                <TableHead>Nome/Razão social</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Vínculo cadastral</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }, (_, row) => (
                <TableRow key={row}>
                  {Array.from({ length: 8 }, (_, column) => (
                    <TableCell key={column}>
                      <Skeleton
                        className={
                          column === 0
                            ? 'mx-auto size-4 rounded-full'
                            : 'h-4 w-full min-w-16'
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
