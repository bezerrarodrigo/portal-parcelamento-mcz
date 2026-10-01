import { User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function SidebarSelecao() {
  return (
    <aside className='flex shrink-0 gap-4 border-b border-line bg-white px-4 py-3 md:w-[108px] md:flex-col md:items-center md:gap-6 md:border-r md:border-b-0 md:py-8'>
      <div className='flex items-center gap-2 text-blue md:flex-col md:gap-2'>
        <span className='flex size-10 items-center justify-center rounded-full bg-sand text-ink'>
          <User size={20} />
        </span>
        <span className='text-[0.72rem] font-semibold text-ink-soft'>
          Selecionar cadastro
        </span>
      </div>
      <Link
        href='/'
        className='flex items-center gap-2 text-ink-soft no-underline hover:text-orange md:flex-col md:gap-2'
      >
        <span className='flex size-10 items-center justify-center rounded-full bg-sand text-ink'>
          <LogOut size={20} />
        </span>
        <span className='text-[0.72rem] font-semibold'>Voltar</span>
      </Link>
    </aside>
  );
}
