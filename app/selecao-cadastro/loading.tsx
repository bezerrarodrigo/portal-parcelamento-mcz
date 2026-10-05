import { Skeleton } from '@/components/ui/skeleton';
import SidebarSelecao from './components/sidebar-selecao';
import { TabelaCadastrosSkeleton } from './components/tabela-cadastros';

export default function SelecaoCadastroLoading() {
  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarSelecao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10'>
        <h1 className='m-0 mb-6 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-ink uppercase'>
          Selecionar cadastro
        </h1>

        <div
          aria-hidden='true'
          className='mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-4'
        >
          <Skeleton className='h-10 w-full md:w-44' />
          <Skeleton className='h-10 w-full md:flex-1' />
          <Skeleton className='h-10 w-full md:w-28' />
        </div>

        <TabelaCadastrosSkeleton />

        <div className='mt-6'>
          <Skeleton className='h-10 w-full md:w-32' />
        </div>
      </div>
    </main>
  );
}
