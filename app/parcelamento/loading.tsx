import SidebarNavegacao from '../components/sidebar-navegacao';
import { Skeleton } from '@/components/ui/skeleton';

export default function ParcelamentoLoading() {
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

        <div
          role='status'
          aria-label='Carregando opções de parcelamento'
          className='mt-8 grid gap-5'
        >
          {[0, 1].map((option) => (
            <section
              key={option}
              aria-hidden='true'
              className='overflow-hidden rounded-md border border-line bg-white shadow-sm'
            >
              <div className='flex min-h-16 items-center gap-3 px-3 py-4 sm:px-5'>
                <Skeleton className='size-4 rounded-sm' />
                <Skeleton className='h-4 w-48 max-w-[70%]' />
              </div>
              <div className='hidden px-5 pb-5 md:block'>
                <div className='grid grid-cols-6 gap-2'>
                  {Array.from({ length: 6 }, (_, index) => (
                    <Skeleton key={index} className='h-8' />
                  ))}
                </div>
                <div className='mt-2 grid grid-cols-6 gap-2'>
                  {Array.from({ length: 6 }, (_, index) => (
                    <Skeleton key={index} className='h-8' />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
