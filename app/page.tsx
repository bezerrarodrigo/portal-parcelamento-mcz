import Image from 'next/image';
import AplicacoesOnline from './components/aplicacoes-online';
import MaisAcessados from './components/mais-acessados';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col antialiased'>
      <div className='flex flex-col w-full my-10 justify-center items-center space-y-10'>
        <Image
          src='/logoAtual.svg'
          alt='Brasão da Prefeitura de Maceió'
          width={600}
          height={600}
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      <div className='w-full pb-10 '>
        <section className='flex w-full flex-col items-stretch gap-6 md:flex-row md:items-center lg:bg-sky-800'>
          <div className='flex w-full justify-center px-6 md:w-1/3 md:justify-center '>
            <Link href='https://planmobi.maceio.al.gov.br/' target='_blank'>
              <Image
                src='/maceio_topo.png'
                alt='Banner informativo'
                width={430}
                height={410}
                className='h-auto w-full  object-contain'
              />
            </Link>
          </div>

          <div className='w-full md:w-2/3 '>
            <MaisAcessados />
          </div>
        </section>
        <AplicacoesOnline />
      </div>
    </main>
  );
}
