import { Skeleton } from '@/components/ui/skeleton';
import SidebarNavegacao from '../components/sidebar-navegacao';

export default function GuiaExtratoDebitoLoading() {
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

        <div
          role='status'
          aria-label='Carregando extrato de débitos'
          aria-busy='true'
          className='grid gap-4'
        >
          <div aria-hidden='true' className='grid gap-4'>
            <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(120px,0.7fr)_minmax(180px,1.1fr)_minmax(180px,1.1fr)_auto]'>
              <Skeleton className='h-14' />
              <Skeleton className='h-14' />
              <Skeleton className='h-14' />
              <Skeleton className='mt-auto h-9 w-full lg:w-24' />
            </div>

            <div className='overflow-hidden border border-line bg-white'>
              <div className='overflow-x-auto p-2'>
                <div className='grid min-w-280 grid-cols-13 gap-2'>
                  {Array.from({ length: 13 }, (_, column) => (
                    <Skeleton key={`header-${column}`} className='h-7' />
                  ))}
                </div>
                <div className='mt-2 grid min-w-280 gap-2'>
                  {Array.from({ length: 8 }, (_, row) => (
                    <div key={`row-${row}`} className='grid grid-cols-13 gap-2'>
                      {Array.from({ length: 13 }, (_, column) => (
                        <Skeleton
                          key={`cell-${row}-${column}`}
                          className='h-7'
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Skeleton className='ml-auto h-4 w-36' />

            <div className='overflow-hidden border border-line bg-white p-3'>
              <div className='grid min-w-162.5 grid-cols-6 gap-3'>
                {Array.from({ length: 6 }, (_, column) => (
                  <Skeleton key={`total-${column}`} className='h-7' />
                ))}
              </div>
              <div className='mt-2 grid min-w-162.5 grid-cols-6 gap-3'>
                {Array.from({ length: 6 }, (_, column) => (
                  <Skeleton key={`value-${column}`} className='h-7' />
                ))}
              </div>
            </div>

            <Skeleton className='h-4 w-full' />

            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-9 w-20' />
              <Skeleton className='h-9 w-40' />
              <Skeleton className='h-9 w-32' />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
