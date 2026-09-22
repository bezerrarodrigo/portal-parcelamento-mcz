'use client';

import type { Debito } from '@/lib/mock-debitos';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TabelaDebitosProps {
  debitos: Debito[];
  selecionados: Set<string>;
  onToggle: (id: string) => void;
}

export default function TabelaDebitos({
  debitos,
  selecionados,
  onToggle,
}: TabelaDebitosProps) {
  return (
    <div className='debitos-table-wrapper'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
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
          {debitos.map((debito) => (
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
              <TableCell>{formatCurrency(debito.jurosMultaDesconto)}</TableCell>
              <TableCell>{formatCurrency(debito.total)}</TableCell>
              <TableCell>{debito.atrasoDias ?? '-'}</TableCell>
              <TableCell>{debito.situacao}</TableCell>
              <TableCell>{debito.numeroAutoInfracao ?? '-'}</TableCell>
            </TableRow>
          ))}
          {debitos.length === 0 && (
            <TableRow>
              <TableCell colSpan={13} className='debitos-empty'>
                Nenhum débito encontrado para os filtros selecionados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
