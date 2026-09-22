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
    <main className='content-section negociacao-page'>
      <div className='page-shell'>
        <p className='eyebrow'>Negociação de débitos</p>
        <h1 className='negociacao-title'>Relação de débitos</h1>
        <p className='negociacao-subtitle'>
          Cadastro: {cadastro === 'imovel' ? 'Imóvel' : 'CPF/CNPJ'} · Inscrição
          municipal: {inscricao || 'não informada'}
        </p>

        <RelacaoDebitos debitos={debitos} />
      </div>
    </main>
  );
}
