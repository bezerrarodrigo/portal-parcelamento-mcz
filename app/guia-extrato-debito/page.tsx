import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { obterExtratoDebito } from '@/lib/api/extrato-debito';
import SidebarNavegacao from '../components/sidebar-navegacao';
import TabelaExtratoDebito from './components/tabela-extrato-debito';

interface GuiaExtratoDebitoPageProps {
  searchParams: Promise<{
    id?: string;
    inscricao?: string;
  }>;
}

export default async function GuiaExtratoDebitoPage({
  searchParams,
}: GuiaExtratoDebitoPageProps) {
  const { id, inscricao } = await searchParams;
  const voltarHref = inscricao
    ? `/dashboard?${new URLSearchParams({ id: id ?? '', inscricao })}`
    : '/selecao-cadastro';

  let erro: string | null = null;
  let extrato = null;

  if (!id) {
    erro = 'Selecione um cadastro antes de consultar os débitos.';
  } else {
    try {
      extrato = await obterExtratoDebito(id);
    } catch (error) {
      erro =
        error instanceof Error
          ? error.message
          : 'Não foi possível consultar o extrato de débitos.';
    }
  }

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarNavegacao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-8 md:py-10'>
        <h1 className='m-0 text-2xl font-bold tracking-normal text-ink uppercase'>
          Visualizar débitos
        </h1>
        <p className='mb-5 mt-1 text-sm text-ink-soft'>
          Veja aqui todos os débitos em aberto.
        </p>

        {extrato ? (
          <TabelaExtratoDebito extrato={extrato} voltarHref={voltarHref} />
        ) : (
          <div
            role='alert'
            className='border border-line bg-white p-5 text-sm text-ink'
          >
            <p className='m-0'>{erro}</p>
            {id ? (
              <Button asChild variant='outline' className='mt-4'>
                <Link
                  href={`/guia-extrato-debito?${new URLSearchParams({ id, ...(inscricao ? { inscricao } : {}) })}`}
                >
                  Tentar novamente
                </Link>
              </Button>
            ) : (
              <Button asChild variant='outline' className='mt-4'>
                <Link href='/selecao-cadastro'>Selecionar cadastro</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
