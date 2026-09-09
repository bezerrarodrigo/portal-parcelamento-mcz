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

const negotiationOptions = [
  {
    title: 'Pagamento à vista',
    description:
      'Consulte seus débitos e escolha a melhor condição para regularizar tudo de uma vez.',
    icon: WalletCards,
    href: '/servicos/cidadao/guia',
    action: 'Acessar pagamento à vista',
  },
  {
    title: 'Pagamento parcelado',
    description:
      'Organize suas pendências em parcelas que cabem no seu planejamento financeiro.',
    icon: CalendarCheck,
    href: '/servicos/empresa/portal-negociacao-imovel',
    action: 'Acessar parcelamento',
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

export default function Home() {
  return (
    <main>
      <section className='hero-panel'>
        <div className='page-shell hero-grid'>
          <div className='hero-copy'>
            <p className='eyebrow'>Portal de serviços tributários</p>
            <h1>Resolva suas pendências com a Prefeitura de Maceió.</h1>
            <p className='hero-description'>
              Consulte débitos, emita guias e encontre a melhor opção para
              regularizar sua situação de forma simples, segura e online.
            </p>
            <div className='hero-actions'>
              <Link className='button button-primary' href='#negociacao'>
                Começar agora <ArrowRight size={18} />
              </Link>
              <Link
                className='button button-quiet'
                href='/servicos/cidadao/guia'
              >
                Consultar débitos
              </Link>
            </div>
          </div>
          <div className='hero-aside' aria-label='Resumo do portal'>
            <Landmark size={42} strokeWidth={1.4} />
            <span className='hero-aside-label'>Atendimento digital</span>
            <strong>Mais praticidade para cuidar das suas obrigações.</strong>
            <span className='hero-aside-line' />
            <span className='hero-aside-note'>Disponível todos os dias</span>
          </div>
        </div>
      </section>

      <section className='content-section' id='negociacao'>
        <div className='page-shell'>
          <div className='section-heading'>
            <p className='eyebrow'>Escolha seu caminho</p>
            <h2>Opções para negociação</h2>
            <p>
              Encontre uma alternativa adequada para consultar e regularizar
              seus débitos municipais.
            </p>
          </div>
          <div className='negotiation-grid'>
            {negotiationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <article className='negotiation-card' key={option.title}>
                  <div className='icon-badge'>
                    <Icon size={24} />
                  </div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <Link href={option.href} className='card-link'>
                    {option.action} <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className='service-band' id='servicos'>
        <div className='page-shell'>
          <div className='section-heading section-heading-light'>
            <p className='eyebrow'>Acesso rápido</p>
            <h2>Serviços disponíveis</h2>
            <p>Tenha os principais serviços tributários a poucos cliques.</p>
          </div>
          <div className='service-grid'>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  href={service.href}
                  className='service-card'
                  key={service.title}
                >
                  <Icon size={28} strokeWidth={1.5} />
                  <span>
                    <strong>{service.title}</strong>
                    <small>{service.description}</small>
                  </span>
                  <ArrowRight className='service-arrow' size={20} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className='content-section process-section' id='como-funciona'>
        <div className='page-shell'>
          <div className='section-heading'>
            <p className='eyebrow'>É simples começar</p>
            <h2>Como funciona</h2>
            <p>Veja as etapas para regularizar sua situação pela internet.</p>
          </div>
          <div className='steps-grid'>
            {steps.map((step) => (
              <article className='step-card' key={step.number}>
                <span className='step-number'>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='benefits-section'>
        <div className='page-shell benefits-grid'>
          <div>
            <p className='eyebrow'>Por que usar o portal?</p>
            <h2>Regularize sem complicação.</h2>
            <p className='benefits-intro'>
              Tudo o que você precisa para consultar e organizar seus débitos em
              um único lugar.
            </p>
          </div>
          <div className='benefit-list'>
            <div>
              <ShieldCheck size={24} />
              <span>
                <strong>Segurança</strong>
                <small>Seus dados tratados com responsabilidade.</small>
              </span>
            </div>
            <div>
              <BadgeCheck size={24} />
              <span>
                <strong>Comodidade</strong>
                <small>Resolva suas pendências sem sair de casa.</small>
              </span>
            </div>
            <div>
              <ListChecks size={24} />
              <span>
                <strong>Praticidade</strong>
                <small>Informações e guias disponíveis online.</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className='closing-section'>
        <div className='page-shell closing-inner'>
          <CheckCircle2 size={30} />
          <div>
            <h2>Conte com o Portal de Serviços da Prefeitura.</h2>
            <p>Acesse os serviços digitais e mantenha sua situação em dia.</p>
          </div>
          <Link className='button button-primary' href='#negociacao'>
            Acessar portal <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
