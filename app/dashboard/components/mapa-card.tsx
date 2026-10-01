'use client';

import { useState } from 'react';

export default function MapaCard() {
  const [visivel, setVisivel] = useState(true);

  return (
    <section className='border border-line bg-white'>
      <header className='flex items-center justify-between bg-gray-100 px-4 py-2.5'>
        <h2 className='m-0 text-[0.86rem] font-bold text-ink'>Mapa</h2>
        <button
          type='button'
          onClick={() => setVisivel((atual) => !atual)}
          className='text-[0.8rem] font-semibold text-blue hover:text-orange'
        >
          {visivel ? 'Ocultar' : 'Mostrar'}
        </button>
      </header>

      {visivel && (
        <div className='flex h-64 items-center justify-center p-4 text-[0.82rem] text-ink-soft'>
          Mapa indisponível neste protótipo.
        </div>
      )}
    </section>
  );
}
