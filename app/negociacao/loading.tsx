import { Skeleton } from '@/components/ui/skeleton';
import SidebarNavegacao from '../components/sidebar-navegacao';

export default function NegociacaoLoading() {
  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarNavegacao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10'>
        <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
          Negociação de débitos
        </p>
        <h1 className='m-0 text-[clamp(1.6rem,3vw,2.1rem)] text-ink'>
          Relação de débitos
        </h1>

        <div
          role='status'
          aria-label='Carregando dados da negociação'
          aria-busy='true'
          className='mt-2 grid gap-7'
        >
          <div aria-hidden='true' className='grid gap-7'>
            <Skeleton className='h-5 w-80 max-w-full' />

            <section>
              <Skeleton className='mb-2 h-6 w-44' />
              <div className='grid gap-4 border border-line bg-white p-5 md:grid-cols-2'>
                {[0, 1, 2].map((field) => (
                  <div key={field} className='grid gap-2'>
                    <Skeleton className='h-4 w-28' />
                    <Skeleton className='h-9 w-full' />
                  </div>
                ))}
                <div className='flex justify-end md:col-span-2'>
                  <Skeleton className='h-10 w-full md:w-28' />
                </div>
              </div>
            </section>

            <div className='hidden border border-line bg-white md:block'>
              <div className='overflow-x-auto p-2'>
                <div className='grid min-w-[1000px] grid-cols-[repeat(13,minmax(0,1fr))] gap-2'>
                  {Array.from({ length: 13 }, (_, column) => (
                    <Skeleton key={column} className='h-8' />
                  ))}
                </div>
                <div className='mt-2 grid min-w-[1000px] gap-2'>
                  {Array.from({ length: 5 }, (_, row) => (
                    <div
                      key={row}
                      className='grid grid-cols-[repeat(13,minmax(0,1fr))] gap-2'
                    >
                      {Array.from({ length: 13 }, (_, column) => (
                        <Skeleton key={column} className='h-9' />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid gap-3 md:hidden'>
              {Array.from({ length: 3 }, (_, card) => (
                <div
                  key={card}
                  className='grid gap-3 border border-line bg-white p-4'
                >
                  <Skeleton className='h-5 w-2/3' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              ))}
            </div>

            <div className='flex flex-wrap gap-4'>
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className='h-4 w-32' />
              ))}
            </div>

            <div className='grid gap-3 border border-line bg-white p-5'>
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-8 w-full' />
            </div>

            <div className='grid gap-5 border border-line bg-white p-6'>
              <div className='grid gap-4 md:grid-cols-2'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
              </div>
              <Skeleton className='h-20 w-full' />
            </div>

            <Skeleton className='h-10 w-full md:w-44' />
          </div>
        </div>
      </div>
    </main>
  );
}
