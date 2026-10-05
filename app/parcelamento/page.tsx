import Link from 'next/link';
import { obterOpcoesParcelamento } from '@/lib/api/parcelamentos';
import SidebarNavegacao from '../components/sidebar-navegacao';
import SelecaoTransacao from './components/selecao-transacao';

interface ParcelamentoPageProps {
  searchParams: Promise<{
    cadastro?: string;
    inscricao?: string;
    id?: string;
  }>;
}

export default async function ParcelamentoPage({
  searchParams,
}: ParcelamentoPageProps) {
  const { cadastro, inscricao, id } = await searchParams;
  let opcoes = null;
  let erro: string | null = null;

  if (!id) {
    erro = 'Selecione um cadastro antes de consultar as opções de parcelamento.';
  } else {
    try {
      opcoes = await obterOpcoesParcelamento(id);
    } catch (error) {
      erro =
        error instanceof Error
          ? error.message
          : 'Não foi possível consultar as opções de parcelamento.';
    }
  }

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarNavegacao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10'>
        <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
          Relação de débitos
        </p>
        <h1 className='m-0 text-[clamp(1.6rem,3vw,2.1rem)] tracking-[-0.02em] text-ink'>
          Escolha uma das opções para avançar
        </h1>

        {opcoes && id ? (
          <SelecaoTransacao
            cadastro={cadastro ?? 'imovel'}
            idCadastro={id}
            inscricao={inscricao}
            opcoes={opcoes}
          />
        ) : (
          <div
            role='alert'
            className='mt-8 border border-line bg-white p-5 text-ink'
          >
            <p className='m-0'>{erro}</p>
            {id ? (
              <Link
                href={`/parcelamento?${new URLSearchParams({ id, ...(inscricao ? { inscricao } : {}) })}`}
                className='mt-3 inline-block font-semibold text-blue underline underline-offset-2'
              >
                Tentar novamente
              </Link>
            ) : (
              <Link
                href='/selecao-cadastro'
                className='mt-3 inline-block font-semibold text-blue underline underline-offset-2'
              >
                Selecionar cadastro
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
