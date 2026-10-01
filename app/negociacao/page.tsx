import { getDebitosPorInscricao } from '@/lib/mock-debitos';
import SidebarNavegacao from '../components/sidebar-navegacao';
import RelacaoDebitos from './components/relacao-debitos';

interface NegociacaoPageProps {
  searchParams: Promise<{
    cadastro?: string;
    inscricao?: string;
    mode?: string;
  }>;
}

export default async function NegociacaoPage({
  searchParams,
}: NegociacaoPageProps) {
  const { cadastro, inscricao } = await searchParams;
  const debitos = getDebitosPorInscricao(inscricao ?? '');

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarNavegacao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10'>
        <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
          Negociação de débitos
        </p>
        <h1 className='m-0 text-[clamp(1.6rem,3vw,2.1rem)] tracking-[-0.02em] text-ink'>
          Relação de débitos
        </h1>
        <p className='mt-2 mb-8 text-ink-soft'>
          Cadastro: {cadastro === 'imovel' ? 'Imóvel' : 'CPF/CNPJ'} · Inscrição
          municipal: {inscricao || 'não informada'}
        </p>

        <RelacaoDebitos debitos={debitos} />
      </div>
    </main>
  );
}
