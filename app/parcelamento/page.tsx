import SidebarNavegacao from '../components/sidebar-navegacao';
import SelecaoTransacao from './components/selecao-transacao';

interface ParcelamentoPageProps {
  searchParams: Promise<{
    cadastro?: string;
    inscricao?: string;
  }>;
}

export default async function ParcelamentoPage({
  searchParams,
}: ParcelamentoPageProps) {
  const { cadastro, inscricao } = await searchParams;

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

        <SelecaoTransacao
          cadastro={cadastro ?? 'imovel'}
          inscricao={inscricao}
        />
      </div>
    </main>
  );
}
