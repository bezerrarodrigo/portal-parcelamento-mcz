'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Cadastro } from '@/lib/mock-cadastros';

interface TabelaCadastrosProps {
  cadastros: Cadastro[];
  selecionado: string | null;
  onSelecionar: (id: string) => void;
}

export default function TabelaCadastros({
  cadastros,
  selecionado,
  onSelecionar,
}: TabelaCadastrosProps) {
  return (
    <div className='border border-line bg-white'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>Selecione</TableHead>
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
                <TableCell>
                  <input
                    type='radio'
                    name='cadastro-selecionado'
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
                <TableCell className='min-w-70 whitespace-normal'>
                  {item.endereco}
                </TableCell>
                <TableCell>{item.vinculoCadastral}</TableCell>
                <TableCell>{item.situacao}</TableCell>
              </TableRow>
            ))}
            {cadastros.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className='text-center text-ink-soft'>
                  Nenhum cadastro encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
