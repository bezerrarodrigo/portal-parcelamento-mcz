import { notFound } from 'next/navigation';
import { getCadastroPorInscricao } from '@/lib/mock-cadastros';
import { obterResumoDebitos } from '@/lib/api/debitos';
import SidebarNavegacao from '../components/sidebar-navegacao';
import DadosImovel from './components/dados-imovel';
import DebitosResumo from './components/debitos-resumo';
import MapaCard from './components/mapa-card';

interface DashboardPageProps {
  searchParams: Promise<{
    inscricao?: string;
    id?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { inscricao, id } = await searchParams;
  const cadastro = inscricao ? getCadastroPorInscricao(inscricao) : undefined;

  if (!cadastro) {
    notFound();
  }

  // Sem o id do cadastro (codigoCadastro) não há como consultar o SIAT; mantém a tela de pé com totais zerados.
  const { vencidos, aVencer, total } = id
    ? await obterResumoDebitos(id).catch(() => ({
        vencidos: 0,
        aVencer: 0,
        total: 0,
      }))
    : { vencidos: 0, aVencer: 0, total: 0 };

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarNavegacao />

      <div className='mx-auto flex w-full max-w-360 flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]'>
          <DadosImovel cadastro={cadastro} />
          <MapaCard />
        </div>

        <DebitosResumo vencidos={vencidos} aVencer={aVencer} total={total} />
      </div>
    </main>
  );
}
