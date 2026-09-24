'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Debito } from '@/lib/mock-debitos';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TabelaDebitosProps {
  debitos: Debito[];
  selecionados: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  todosSelecionados: boolean;
}

const ITENS_POR_PAGINA = 10;

export default function TabelaDebitos({
  debitos,
  selecionados,
  onToggle,
  onToggleAll,
  todosSelecionados,
}: TabelaDebitosProps) {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(
    1,
    Math.ceil(debitos.length / ITENS_POR_PAGINA),
  );
  const paginaAtual = Math.min(pagina, totalPaginas);

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const debitosPagina = debitos.slice(inicio, inicio + ITENS_POR_PAGINA);

  return (
    <div className='border border-line bg-white'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>
                <Checkbox
                  checked={debitos.length > 0 && todosSelecionados}
                  onCheckedChange={() => onToggleAll()}
                  aria-label={
                    todosSelecionados
                      ? 'Desmarcar todos os débitos da pesquisa'
                      : 'Marcar todos os débitos da pesquisa'
                  }
                />
              </TableHead>
              <TableHead>Tributo</TableHead>
              <TableHead>Exercício</TableHead>
              <TableHead>Parcela</TableHead>
              <TableHead>Cód. Lacto</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Vlr Lançado</TableHead>
              <TableHead>Vlr Atualizado</TableHead>
              <TableHead>Jur/Mul/Desc</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Atraso (dias)</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Nº Auto de Infração</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debitosPagina.map((debito) => (
              <TableRow key={debito.id}>
                <TableCell>
                  <Checkbox
                    checked={selecionados.has(debito.id)}
                    onCheckedChange={() => onToggle(debito.id)}
                    aria-label={`Selecionar débito ${debito.tributo} parcela ${debito.parcela}`}
                  />
                </TableCell>
                <TableCell>{debito.tributo}</TableCell>
                <TableCell>{debito.exercicio}</TableCell>
                <TableCell>{debito.parcela}</TableCell>
                <TableCell>{debito.codLacto}</TableCell>
                <TableCell>{formatDate(debito.vencimento)}</TableCell>
                <TableCell>{formatCurrency(debito.valorLancado)}</TableCell>
                <TableCell>{formatCurrency(debito.valorAtualizado)}</TableCell>
                <TableCell>
                  {formatCurrency(debito.jurosMultaDesconto)}
                </TableCell>
                <TableCell>{formatCurrency(debito.total)}</TableCell>
                <TableCell>{debito.atrasoDias ?? '-'}</TableCell>
                <TableCell>{debito.situacao}</TableCell>
                <TableCell>{debito.numeroAutoInfracao ?? '-'}</TableCell>
              </TableRow>
            ))}
            {debitos.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} className='text-center text-ink-soft'>
                  Nenhum débito encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {debitos.length > 0 && (
        <div className='flex items-center justify-between gap-3 border-t border-line px-4 py-2 bg-gray-50'>
          <span className='text-sm text-ink-soft'>
            Página {paginaAtual} de {totalPaginas} · {debitos.length}{' '}
            {debitos.length === 1 ? 'débito' : 'débitos'}
          </span>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon-sm'
              onClick={() =>
                setPagina((atual) =>
                  Math.max(1, Math.min(atual, totalPaginas) - 1),
                )
              }
              disabled={paginaAtual === 1}
              aria-label='Página anterior'
            >
              <ChevronLeft />
            </Button>
            <Button
              variant='outline'
              size='icon-sm'
              onClick={() =>
                setPagina((atual) =>
                  Math.min(totalPaginas, Math.min(atual, totalPaginas) + 1),
                )
              }
              disabled={paginaAtual === totalPaginas}
              aria-label='Próxima página'
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
