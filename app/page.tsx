import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  FileText,
  Landmark,
  ListChecks,
  Search,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import FormularioNegociacao from './components/formulario-negociacao';

const negotiationOptions = [
  {
    title: 'Pagamento à vista',
    description:
      'Consulte seus débitos e escolha a melhor condição para regularizar tudo de uma vez.',
    icon: WalletCards,
    href: '/servicos/cidadao/guia',
    action: 'Acessar pagamento à vista',
    mode: 'vista' as const,
  },
  {
    title: 'Pagamento parcelado',
    description:
      'Organize suas pendências em parcelas que cabem no seu planejamento financeiro.',
    icon: CalendarCheck,
    href: '/servicos/empresa/portal-negociacao-imovel',
    action: 'Acessar parcelamento',
    mode: 'parcelado' as const,
  },
];

const services = [
  {
    title: 'Consultar débitos',
    description: 'Confira suas pendências e gere o extrato atualizado.',
    icon: Search,
    href: '/servicos/cidadao/guia',
    action: 'Consultar',
  },
  {
    title: 'Emitir guia',
    description: 'Consulte e emita a guia dos débitos em aberto.',
    icon: FileText,
    href: '/servicos/cidadao/guia',
    action: 'Emitir guia',
  },
];

const steps = [
  {
    number: '01',
    title: 'Solicite acesso ao sistema',
    description:
      'Preencha seus dados cadastrais e receba as instruções de acesso no seu e-mail.',
  },
  {
    number: '02',
    title: 'Visualize seus débitos',
    description:
      'Depois de se identificar, confira todos os débitos disponíveis para regularização.',
  },
  {
    number: '03',
    title: 'Regularize suas dívidas',
    description:
      'Escolha a condição, a data do primeiro pagamento e a quantidade de parcelas.',
  },
];

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded px-4.5 text-[0.84rem] font-bold no-underline transition-[transform,background-color] duration-200 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]';
const buttonPrimary = `${buttonBase} bg-orange text-white hover:-translate-y-px hover:bg-[#cf5f21]`;
const buttonQuiet = `${buttonBase} border border-white/45 text-white hover:bg-white/10`;

export default function Home() {
  return (
    <main>
      <section className='overflow-hidden bg-blue-deep text-white'>
        <div className='mx-auto grid min-h-[455px] w-[min(1120px,calc(100%-48px))] grid-cols-1 items-center gap-9 py-13 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:gap-20 md:py-16'>
          <div className='max-w-[680px]'>
            <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
              Portal de serviços tributários
            </p>
            <h1 className='m-0 max-w-[650px] text-[clamp(2.25rem,5vw,4.2rem)] leading-[1.04] tracking-[-0.035em]'>
              Resolva suas pendências com a Prefeitura de Maceió.
            </h1>
            <p className='mt-[22px] max-w-[570px] text-[1.08rem] leading-[1.65] text-[#d8e6ed]'>
              Consulte débitos, emita guias e encontre a melhor opção para
              regularizar sua situação de forma simples, segura e online.
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Link className={buttonPrimary} href='#negociacao'>
                Começar agora <ArrowRight size={18} />
              </Link>
              <Link className={buttonQuiet} href='/servicos/cidadao/guia'>
                Consultar débitos
              </Link>
            </div>
          </div>
          <div
            className='justify-self-start rounded border border-white/25 bg-white/[0.07] p-7.5 max-w-66.25 md:justify-self-end'
            aria-label='Resumo do portal'
          >
            <Landmark size={42} strokeWidth={1.4} />
            <span className='block text-[0.78rem] text-[#bbd2dd]'>
              Atendimento digital
            </span>
            <strong className='my-5.5 block text-[1.24rem] leading-[1.35]'>
              Mais praticidade para cuidar das suas obrigações.
            </strong>
            <span className='mb-3.5 block h-0.75 w-10.5 bg-orange' />
            <span className='block text-[0.78rem] text-[#bbd2dd]'>
              Disponível todos os dias
            </span>
          </div>
        </div>
      </section>

      <section className='bg-sand py-15 md:py-22' id='negociacao'>
        <div className='mx-auto w-[min(1120px,calc(100%-48px))]'>
          <div className='mb-6.5 max-w-160 md:mb-8.5'>
            <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
              Escolha seu caminho
            </p>
            <h2 className='m-0 text-[clamp(1.8rem,3vw,2.55rem)] leading-[1.1] tracking-tight text-ink'>
              Opções para negociação
            </h2>
            <p className='mt-3.5 leading-[1.65] text-ink-soft'>
              Encontre uma alternativa adequada para consultar e regularizar
              seus débitos municipais.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
            {negotiationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <article
                  className='border border-line border-t-4 border-t-orange bg-white p-7.5 shadow-[0_12px_24px_rgba(23,50,77,0.05)]'
                  key={option.title}
                >
                  <div className='mb-6 flex h-12 w-12 items-center justify-center bg-[#fff0e6] text-orange'>
                    <Icon size={24} />
                  </div>
                  <h3 className='m-0 text-[1.3rem] text-ink'>{option.title}</h3>
                  <p className='mt-3 mb-6 leading-[1.6] text-ink-soft'>
                    {option.description}
                  </p>
                  <FormularioNegociacao mode={option.mode} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className='bg-blue py-[78px]' id='servicos'>
        <div className='mx-auto w-[min(1120px,calc(100%-48px))]'>
          <div className='mb-6.5 max-w-[640px] md:mb-8.5'>
            <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
              Acesso rápido
            </p>
            <h2 className='m-0 text-[clamp(1.8rem,3vw,2.55rem)] leading-[1.1] tracking-[-0.025em] text-white'>
              Serviços disponíveis
            </h2>
            <p className='mt-3.5 leading-[1.65] text-[#c6dce5]'>
              Tenha os principais serviços tributários a poucos cliques.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  href={service.href}
                  className='flex items-center gap-4.5 border border-white/[0.22] p-[23px] text-white no-underline transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
                  key={service.title}
                >
                  <Icon size={28} strokeWidth={1.5} />
                  <span className='flex-1'>
                    <strong className='block text-[1.05rem]'>
                      {service.title}
                    </strong>
                    <small className='mt-1.5 block leading-[1.45] text-[#c6dce5]'>
                      {service.description}
                    </small>
                  </span>
                  <ArrowRight className='text-[#f6b65b]' size={20} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className='bg-white py-15 md:py-22' id='como-funciona'>
        <div className='mx-auto w-[min(1120px,calc(100%-48px))]'>
          <div className='mb-6.5 max-w-[640px] md:mb-8.5'>
            <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
              É simples começar
            </p>
            <h2 className='m-0 text-[clamp(1.8rem,3vw,2.55rem)] leading-[1.1] tracking-[-0.025em] text-ink'>
              Como funciona
            </h2>
            <p className='mt-3.5 leading-[1.65] text-ink-soft'>
              Veja as etapas para regularizar sua situação pela internet.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {steps.map((step) => (
              <article
                className='relative border-t border-line p-[26px_24px]'
                key={step.number}
              >
                <span className='mb-5.5 block text-[1.1rem] font-extrabold tracking-[0.08em] text-orange'>
                  {step.number}
                </span>
                <h3 className='m-0 text-[1.3rem] text-ink'>{step.title}</h3>
                <p className='mt-3 mb-6 leading-[1.6] text-ink-soft'>
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-[#e8f0f1] py-[78px]'>
        <div className='mx-auto grid w-[min(1120px,calc(100%-48px))] grid-cols-1 items-center gap-8.5 md:grid-cols-[0.85fr_1.15fr] md:gap-20'>
          <div>
            <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
              Por que usar o portal?
            </p>
            <h2 className='m-0 text-[clamp(1.8rem,3vw,2.55rem)] leading-[1.1] tracking-[-0.025em] text-ink'>
              Regularize sem complicação.
            </h2>
            <p className='mt-3.5 leading-[1.65] text-ink-soft'>
              Tudo o que você precisa para consultar e organizar seus débitos em
              um único lugar.
            </p>
          </div>
          <div className='grid gap-4.5'>
            <div className='flex items-start gap-4 border-b border-[#c9dadd] pb-4.5 text-blue'>
              <ShieldCheck size={24} />
              <span className='block'>
                <strong className='block text-ink'>Segurança</strong>
                <small className='mt-[5px] block text-ink-soft'>
                  Seus dados tratados com responsabilidade.
                </small>
              </span>
            </div>
            <div className='flex items-start gap-4 border-b border-[#c9dadd] pb-4.5 text-blue'>
              <BadgeCheck size={24} />
              <span className='block'>
                <strong className='block text-ink'>Comodidade</strong>
                <small className='mt-[5px] block text-ink-soft'>
                  Resolva suas pendências sem sair de casa.
                </small>
              </span>
            </div>
            <div className='flex items-start gap-4 border-b border-[#c9dadd] pb-4.5 text-blue'>
              <ListChecks size={24} />
              <span className='block'>
                <strong className='block text-ink'>Praticidade</strong>
                <small className='mt-[5px] block text-ink-soft'>
                  Informações e guias disponíveis online.
                </small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#fffaf4] py-9'>
        <div className='mx-auto flex w-[min(1120px,calc(100%-48px))] flex-wrap items-start gap-5 md:flex-nowrap md:items-center'>
          <CheckCircle2 className='flex-none text-orange' size={30} />
          <div>
            <h2 className='m-0 text-[1.35rem] text-ink'>
              Conte com o Portal de Serviços da Prefeitura.
            </h2>
            <p className='mt-1.5 text-ink-soft'>
              Acesse os serviços digitais e mantenha sua situação em dia.
            </p>
          </div>
          <Link
            className={`${buttonPrimary} ml-[50px] w-[calc(100%-50px)] flex-none sm:w-auto md:ml-auto`}
            href='#negociacao'
          >
            Acessar portal <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
