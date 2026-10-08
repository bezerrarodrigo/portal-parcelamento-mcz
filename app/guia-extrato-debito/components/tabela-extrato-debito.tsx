'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { LoaderCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/formatters';
import type { ExtratoDebito } from '@/lib/api/extrato-debito';
import {
  emitirGuiaArrecadacao,
  type GuiaArrecadacao,
} from '@/lib/api/guia-arrecadacao';

interface TabelaExtratoDebitoProps {
  extrato: ExtratoDebito;
  voltarHref: string;
  idCadastro: string;
}

function formatarValor(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TabelaExtratoDebito({
  extrato,
  voltarHref,
  idCadastro,
}: TabelaExtratoDebitoProps) {
  const [exercicio, setExercicio] = useState('');
  const [autoInfracao, setAutoInfracao] = useState('');
  const [lancamento, setLancamento] = useState('');
  const [pesquisa, setPesquisa] = useState({
    exercicio: '',
    autoInfracao: '',
    lancamento: '',
  });
  const [selecionados, setSelecionados] = useState<Set<string>>(
    () => new Set(),
  );
  const [emitindoGuia, setEmitindoGuia] = useState(false);
  const [guiaEmitida, setGuiaEmitida] = useState<GuiaArrecadacao | null>(null);
  const [urlPdf, setUrlPdf] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (urlPdf) URL.revokeObjectURL(urlPdf);
    },
    [urlPdf],
  );

  const parcelas = useMemo(() => {
    const termoExercicio = pesquisa.exercicio.trim().toLowerCase();
    const termoAutoInfracao = pesquisa.autoInfracao.trim().toLowerCase();
    const termoLancamento = pesquisa.lancamento.trim().toLowerCase();

    return extrato.parcelas.filter((parcela) => {
      const combinaExercicio =
        !termoExercicio ||
        String(parcela.exercicio ?? '')
          .toLowerCase()
          .includes(termoExercicio);
      const combinaAutoInfracao =
        !termoAutoInfracao ||
        (parcela.numeroAutoInfracao
          ?.toLowerCase()
          .includes(termoAutoInfracao) ??
          false);
      const combinaLancamento =
        !termoLancamento ||
        parcela.codigoLancamento.toLowerCase().includes(termoLancamento);

      return combinaExercicio && combinaAutoInfracao && combinaLancamento;
    });
  }, [extrato.parcelas, pesquisa]);

  function handlePesquisar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPesquisa({ exercicio, autoInfracao, lancamento });
  }

  function handleSelecionarTodos() {
    setSelecionados((atuais) => {
      const todosVisiveisSelecionados =
        parcelas.length > 0 &&
        parcelas.every((parcela) => atuais.has(parcela.id));

      if (todosVisiveisSelecionados) {
        const novosSelecionados = new Set(atuais);
        parcelas.forEach((parcela) => novosSelecionados.delete(parcela.id));
        return novosSelecionados;
      }

      return new Set([...atuais, ...parcelas.map((parcela) => parcela.id)]);
    });
  }

  function handleSelecionar(id: string) {
    setSelecionados((atuais) => {
      const novosSelecionados = new Set(atuais);
      if (novosSelecionados.has(id)) {
        novosSelecionados.delete(id);
      } else {
        novosSelecionados.add(id);
      }
      return novosSelecionados;
    });
  }

  async function handleEmitirGuia() {
    if (selecionados.size === 0 || emitindoGuia) return;

    const janela = window.open('', '_blank');
    if (!janela) {
      toast.error('Permita a abertura de pop-ups para visualizar a guia.');
      return;
    }

    janela.opener = null;
    janela.document.title = 'Preparando guia...';
    setEmitindoGuia(true);

    try {
      const guia = await emitirGuiaArrecadacao(
        idCadastro,
        Array.from(selecionados),
      );
      const novaUrlPdf = URL.createObjectURL(guia.arquivo);
      janela.location.href = novaUrlPdf;
      setUrlPdf(novaUrlPdf);
      setGuiaEmitida(guia);
    } catch (error) {
      janela.close();
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível emitir a guia. Tente novamente.',
      );
    } finally {
      setEmitindoGuia(false);
    }
  }

  const resumo = extrato.totais;

  return (
    <>
      <form
        onSubmit={handlePesquisar}
        className='mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(120px,0.7fr)_minmax(180px,1.1fr)_minmax(180px,1.1fr)_auto]'
      >
        <label className='grid gap-1 text-xs font-medium text-ink-soft'>
          Exercício
          <input
            value={exercicio}
            onChange={(event) => setExercicio(event.target.value)}
            inputMode='numeric'
            className='h-9 min-w-0 border border-line bg-white px-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-blue'
          />
        </label>
        <label className='grid gap-1 text-xs font-medium text-ink-soft'>
          Nº Auto Infração
          <input
            value={autoInfracao}
            onChange={(event) => setAutoInfracao(event.target.value)}
            className='h-9 min-w-0 border border-line bg-white px-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-blue'
          />
        </label>
        <label className='grid gap-1 text-xs font-medium text-ink-soft'>
          Lançamento
          <input
            value={lancamento}
            onChange={(event) => setLancamento(event.target.value)}
            className='h-9 min-w-0 border border-line bg-white px-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-blue'
          />
        </label>
        <Button type='submit' className='mt-auto h-9 gap-2'>
          <Search size={15} aria-hidden='true' />
          Pesquisar
        </Button>
      </form>

      <div className='overflow-x-auto border border-line bg-white'>
        <table className='w-full min-w-280 border-collapse text-[0.7rem] leading-tight text-ink'>
          <thead className='bg-[#e9edef] text-ink-soft'>
            <tr>
              <th className='w-9 border border-line px-2 py-2 text-center font-semibold'>
                <Checkbox
                  checked={
                    parcelas.length > 0 &&
                    parcelas.every((parcela) => selecionados.has(parcela.id))
                  }
                  onCheckedChange={handleSelecionarTodos}
                  aria-label='Selecionar todos os débitos filtrados'
                />
              </th>
              <th className='border border-line px-2 py-2 text-left font-semibold'>
                Tributo
              </th>
              <th className='border border-line px-2 py-2 text-center font-semibold'>
                Exercício
              </th>
              <th className='border border-line px-2 py-2 text-center font-semibold'>
                Parcela
              </th>
              <th className='border border-line px-2 py-2 text-left font-semibold'>
                Cód. Lacto
              </th>
              <th className='border border-line px-2 py-2 text-center font-semibold'>
                Vencimento
              </th>
              <th className='border border-line px-2 py-2 text-right font-semibold'>
                Vlr Lançado
              </th>
              <th className='border border-line px-2 py-2 text-right font-semibold'>
                Vlr Atualizado
              </th>
              <th className='border border-line px-2 py-2 text-right font-semibold'>
                Jur/Mul/Desc
              </th>
              <th className='border border-line px-2 py-2 text-right font-semibold'>
                Total
              </th>
              <th className='border border-line px-2 py-2 text-right font-semibold'>
                Atraso (dias)
              </th>
              <th className='border border-line px-2 py-2 text-center font-semibold'>
                Situação<span className='text-red-600'>*</span>
              </th>
              <th className='border border-line px-2 py-2 text-left font-semibold'>
                Nº Auto de Infração
              </th>
            </tr>
          </thead>
          <tbody>
            {parcelas.map((parcela, index) => (
              <tr
                key={parcela.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f2]'}
              >
                <td className='border border-line px-2 py-1.5 text-center text-ink-soft'>
                  <Checkbox
                    checked={selecionados.has(parcela.id)}
                    onCheckedChange={() => handleSelecionar(parcela.id)}
                    aria-label={`Selecionar débito ${parcela.tributo} parcela ${parcela.parcela}`}
                  />
                </td>
                <td className='border border-line px-2 py-1.5'>
                  {parcela.tributo}
                </td>
                <td className='border border-line px-2 py-1.5 text-center'>
                  {parcela.exercicio ?? '-'}
                </td>
                <td className='border border-line px-2 py-1.5 text-center'>
                  {parcela.parcela}
                </td>
                <td className='border border-line px-2 py-1.5'>
                  {parcela.codigoLancamento}
                </td>
                <td className='border border-line px-2 py-1.5 text-center'>
                  {parcela.vencimento ? formatDate(parcela.vencimento) : '-'}
                </td>
                <td className='border border-line px-2 py-1.5 text-right tabular-nums'>
                  {formatarValor(parcela.valorLancado)}
                </td>
                <td className='border border-line px-2 py-1.5 text-right tabular-nums'>
                  {formatarValor(parcela.valorAtualizado)}
                </td>
                <td className='border border-line px-2 py-1.5 text-right tabular-nums'>
                  {formatarValor(parcela.jurosMultaDesconto)}
                </td>
                <td className='border border-line px-2 py-1.5 text-right tabular-nums'>
                  {formatarValor(parcela.total)}
                </td>
                <td className='border border-line px-2 py-1.5 text-right tabular-nums'>
                  {parcela.atrasoDias ?? ''}
                </td>
                <td className='border border-line px-2 py-1.5 text-center'>
                  {parcela.situacao}
                </td>
                <td className='border border-line px-2 py-1.5'>
                  {parcela.numeroAutoInfracao ?? ''}
                </td>
              </tr>
            ))}
            {parcelas.length === 0 && (
              <tr>
                <td
                  colSpan={13}
                  className='border border-line px-3 py-8 text-center text-sm text-ink-soft'
                >
                  Nenhum débito encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className='mt-2 text-right text-xs text-ink-soft'>
        {parcelas.length} de {extrato.parcelas.length} débito(s)
      </p>

      <div className='mt-4 overflow-x-auto border border-line bg-white'>
        <table className='w-full min-w-162.5 border-collapse text-xs text-ink'>
          <thead className='bg-[#e9edef] text-ink-soft'>
            <tr>
              <th className='px-3 py-2 text-left font-medium'></th>
              <th className='px-3 py-2 text-right font-medium'>Vlr Lançado</th>
              <th className='px-3 py-2 text-right font-medium'>
                Vlr Atualizado
              </th>
              <th className='px-3 py-2 text-right font-medium'>Jur/Mul/Desc</th>
              <th className='px-3 py-2 text-right font-medium'>Honorário</th>
              <th className='px-3 py-2 text-right font-medium'>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-t border-line'>
              <th className='px-3 py-2 text-left font-medium'>
                Total: {extrato.parcelas.length} débitos / Qtd Guias:{' '}
                {resumo.quantidadeGuias} / Vlr Emolumento:{' '}
                {formatarValor(resumo.emolumento)}
              </th>
              <td className='px-3 py-2 text-right tabular-nums'>
                {formatarValor(resumo.lancado)}
              </td>
              <td className='px-3 py-2 text-right tabular-nums'>
                {formatarValor(resumo.atualizado)}
              </td>
              <td className='px-3 py-2 text-right tabular-nums'>
                {formatarValor(resumo.jurosMultaDesconto)}
              </td>
              <td className='px-3 py-2 text-right tabular-nums'>
                {formatarValor(resumo.honorario)}
              </td>
              <td className='px-3 py-2 text-right font-bold tabular-nums'>
                {formatarValor(resumo.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {extrato.legendas.length > 0 && (
        <p className='mt-3 text-[0.68rem] leading-relaxed text-ink-soft'>
          <span className='font-semibold text-red-600'>
            * LEGENDA SITUAÇÃO:
          </span>{' '}
          {extrato.legendas
            .map(
              (legenda) =>
                `${legenda.descricaoReduzida} - ${legenda.descricaoResumida}`,
            )
            .join(' | ')}
        </p>
      )}

      <div className='mt-6 flex flex-wrap gap-2'>
        <Button asChild variant='outline'>
          <Link href={voltarHref}>Voltar</Link>
        </Button>
        <Button
          type='button'
          disabled={selecionados.size === 0 || emitindoGuia}
          onClick={handleEmitirGuia}
        >
          {emitindoGuia && <LoaderCircle className='animate-spin' />}
          {emitindoGuia ? 'Emitindo guia...' : 'Emissão Guia à Vista'}
        </Button>
        <Button disabled>Extrato Débito</Button>
      </div>

      <Dialog
        open={Boolean(guiaEmitida)}
        onOpenChange={(aberto) => {
          if (!aberto) setGuiaEmitida(null);
        }}
      >
        <DialogContent className='max-h-[calc(100vh-2rem)] max-w-xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Guia emitida</DialogTitle>
            <DialogDescription>
              O PDF foi aberto em uma nova aba. Confira os dados de pagamento
              abaixo.
            </DialogDescription>
          </DialogHeader>

          {guiaEmitida && (
            <div className='grid gap-4'>
              <dl className='grid gap-3 sm:grid-cols-2'>
                {guiaEmitida.valor && (
                  <div>
                    <dt className='text-xs text-ink-soft'>Valor</dt>
                    <dd className='m-0 font-semibold text-ink'>
                      R$ {guiaEmitida.valor}
                    </dd>
                  </div>
                )}
                {guiaEmitida.vencimento && (
                  <div>
                    <dt className='text-xs text-ink-soft'>Vencimento</dt>
                    <dd className='m-0 font-semibold text-ink'>
                      {guiaEmitida.vencimento}
                    </dd>
                  </div>
                )}
                {guiaEmitida.codigoBarra && (
                  <div className='sm:col-span-2'>
                    <dt className='text-xs text-ink-soft'>Código de barras</dt>
                    <dd className='m-0 break-all font-mono text-sm text-ink'>
                      {guiaEmitida.codigoBarra}
                    </dd>
                  </div>
                )}
                {guiaEmitida.linhaDigitavel && (
                  <div className='sm:col-span-2'>
                    <dt className='text-xs text-ink-soft'>Linha digitável</dt>
                    <dd className='m-0 break-all font-mono text-sm text-ink'>
                      {guiaEmitida.linhaDigitavel}
                    </dd>
                  </div>
                )}
              </dl>

              {guiaEmitida.qrCode && (
                <div className='grid gap-1'>
                  <h3 className='m-0 text-sm font-semibold text-ink'>PIX</h3>
                  <p className='m-0 break-all border border-line bg-sand p-3 font-mono text-xs text-ink'>
                    {guiaEmitida.qrCode}
                  </p>
                </div>
              )}

              <div className='flex flex-wrap gap-2'>
                {urlPdf && (
                  <Button asChild variant='outline'>
                    <a href={urlPdf} target='_blank' rel='noreferrer'>
                      Abrir PDF novamente
                    </a>
                  </Button>
                )}
                {guiaEmitida.linkQrCode && (
                  <Button asChild variant='outline'>
                    <a
                      href={guiaEmitida.linkQrCode}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Abrir QR Code
                    </a>
                  </Button>
                )}
                {guiaEmitida.linkPagamento && (
                  <Button asChild>
                    <a
                      href={guiaEmitida.linkPagamento}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Pagar com cartão
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
