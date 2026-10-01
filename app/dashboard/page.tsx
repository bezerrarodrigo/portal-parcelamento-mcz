import { notFound } from 'next/navigation';
import { getCadastroPorInscricao } from '@/lib/mock-cadastros';
import { getDebitosPorInscricao } from '@/lib/mock-debitos';
import DadosImovel from './components/dados-imovel';
import DebitosResumo from './components/debitos-resumo';
import MapaCard from './components/mapa-card';
import SidebarDashboard from './components/sidebar-dashboard';

interface DashboardPageProps {
  searchParams: Promise<{
    inscricao?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { inscricao } = await searchParams;
  const cadastro = inscricao ? getCadastroPorInscricao(inscricao) : undefined;

  if (!cadastro) {
    notFound();
  }

  const debitos = getDebitosPorInscricao(cadastro.inscricaoMunicipal);
  const vencidos = debitos
    .filter((debito) => debito.atrasoDias !== null)
    .reduce((soma, debito) => soma + debito.total, 0);
  const aVencer = debitos
    .filter((debito) => debito.atrasoDias === null)
    .reduce((soma, debito) => soma + debito.total, 0);

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarDashboard />

      <div className='mx-auto flex w-full max-w-360 flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]'>
          <DadosImovel cadastro={cadastro} />
          <MapaCard />
        </div>

        <DebitosResumo
          vencidos={vencidos}
          aVencer={aVencer}
          total={vencidos + aVencer}
        />
      </div>
    </main>
  );
}
