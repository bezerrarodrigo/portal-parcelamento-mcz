'use client';

import { useState } from 'react';
import type { Debito, DividaNaoParcelavel } from '@/lib/mock-debitos';
import { formatCurrency } from '@/lib/formatters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ResumoSelecaoProps {
  todos: Debito[];
  selecionados: Debito[];
  dividasNaoParcelaveis: DividaNaoParcelavel[];
}

function somar(debitos: Debito[], campo: keyof Debito) {
  return debitos.reduce((total, debito) => {
    const valor = debito[campo];
    return total + (typeof valor === 'number' ? valor : 0);
  }, 0);
}

export default function ResumoSelecao({
  todos,
  selecionados,
  dividasNaoParcelaveis,
}: ResumoSelecaoProps) {
  const [dialogAberto, setDialogAberto] = useState(false);
  const totalNaoParcelavel = dividasNaoParcelaveis.reduce(
    (total, divida) => total + divida.valor,
    0,
  );

  const linhas = [
    { label: 'Total', grupo: todos },
    { label: 'Selecionado', grupo: selecionados },
  ];

  return (
    <div className='debitos-summary'>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Vlr Lançado</th>
            <th>Vlr Atualizado</th>
            <th>Jur/Mul/Desc</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map(({ label, grupo }) => (
            <tr key={label}>
              <td>
                <strong>{label}</strong>
                <small>
                  {grupo.length} débito(s) / Qtd Guias: {grupo.length ? 1 : 0}
                </small>
              </td>
              <td>{formatCurrency(somar(grupo, 'valorLancado'))}</td>
              <td>{formatCurrency(somar(grupo, 'valorAtualizado'))}</td>
              <td>{formatCurrency(somar(grupo, 'jurosMultaDesconto'))}</td>
              <td>{formatCurrency(somar(grupo, 'total'))}</td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>Dívida(s) que não podem ser parceladas</strong>
            </td>
            <td colSpan={3}>
              <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <button type='button' className='card-link'>
                    Visualizar
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Dívidas que não podem ser parceladas
                    </DialogTitle>
                  </DialogHeader>
                  <ul className='debitos-nao-parcelaveis'>
                    {dividasNaoParcelaveis.map((divida) => (
                      <li key={divida.id}>
                        <span>{divida.descricao}</span>
                        <strong>{formatCurrency(divida.valor)}</strong>
                      </li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
            </td>
            <td>{formatCurrency(totalNaoParcelavel)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
