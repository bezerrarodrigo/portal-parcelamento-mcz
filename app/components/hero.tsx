'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  id: number;
  title: string;
  description?: string;
  image?: string;
  gradient?: string;
  cta?: {
    label: string;
    href: string;
  };
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Bem-vindo ao Portal SIAT',
    image: '/cavalo.jpg',
    description: 'Sistema Integrado de Administração Tributária de Maceió.',
    gradient: 'from-black/90 to-black/60',
  },
  {
    id: 2,
    title: 'Serviços Digitais para Você',
    description:
      'Acesse os principais serviços tributários de forma rápida e segura.',
    gradient: 'from-blue/90 to-blue-600/60',
    cta: { label: 'Carta de Serviços', href: '#' },
  },
  {
    id: 3,
    title: 'Transparência e Agilidade',
    description:
      'Consulte débitos, emita certidões e muito mais sem sair de casa.',
    gradient: 'from-sky-700/90 to-sky-500/60',
    cta: { label: 'Saiba Mais', href: '#' },
  },
];

interface HeroProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
}

export default function Hero({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 6000,
}: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, paused, autoPlayInterval]);

  return (
    <section
      className='relative w-full overflow-hidden'
      style={{ height: 'clamp(300px, 50vw, 560px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label='Carrossel de banners'
    >
      {/* Slides */}
      <div
        className='flex h-full transition-transform duration-700 ease-in-out will-change-transform'
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <article
            key={slide.id}
            className='relative shrink-0 w-full h-full select-none'
            aria-hidden={slides[current].id !== slide.id}
          >
            {/* Background image */}
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className='object-cover'
                priority
              />
            ) : (
              <div className='absolute inset-0 bg-primary' />
            )}

            {/* Gradient overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-linear-to-r',
                slide.gradient ?? 'from-primary/90 to-primary/50',
              )}
            />

            {/* Text content */}
            <div className='relative z-10 flex h-full items-center'>
              <div className='mx-auto w-full max-w-6xl px-6 md:px-12'>
                <h2 className='text-2xl font-bold leading-tight text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl max-w-2xl'>
                  {slide.title}
                </h2>
                {slide.description && (
                  <p className='mt-3 max-w-xl text-sm text-white/90 drop-shadow sm:text-base md:text-lg'>
                    {slide.description}
                  </p>
                )}
                {slide.cta && (
                  <a
                    href={slide.cta.href}
                    className='mt-6 inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
                  >
                    {slide.cta.label}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Arrow: anterior */}
      <button
        onClick={prev}
        aria-label='Slide anterior'
        className='absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
      >
        <CaretLeft className='h-5 w-5' />
      </button>

      {/* Arrow: próximo */}
      <button
        onClick={next}
        aria-label='Próximo slide'
        className='absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
      >
        <CaretRight className='h-5 w-5' />
      </button>

      {/* Dots */}
      <div
        className='absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2'
        role='tablist'
        aria-label='Selecionar slide'
      >
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            role='tab'
            aria-selected={i === current}
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              i === current
                ? 'w-7 bg-white'
                : 'w-2.5 bg-white/50 hover:bg-white/75',
            )}
          />
        ))}
      </div>
    </section>
  );
}
