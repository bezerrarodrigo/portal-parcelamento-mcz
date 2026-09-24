import { getDebitosPorInscricao } from '@/lib/mock-debitos';
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
    <main className='bg-sand py-15 md:py-22'>
      <div className='mx-auto w-[min(1440px,calc(100%-48px))]'>
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
