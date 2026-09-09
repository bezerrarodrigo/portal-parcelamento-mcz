import { notFound } from 'next/navigation';

const empresaServiceTitles: Record<string, string> = {
  'extrato-guia-iptu-taxas': 'Extrato/Guia de IPTU/Taxas',
  'guia-itbi': 'Guia de ITBI',
  'certidao-financeira-imovel': 'Certidão Financeira Imóvel',
  'certidao-financeira-pf-pj-imovel': 'Certidão Financeira PF/PJ',
  'autenticidade-certidao-imovel': 'Autenticidade Certidão',
  'ficha-cadastral-imovel': 'Ficha Cadastral do Imóvel',
  'indicador-economico-imovel': 'Indicador Econômico',
  'portal-negociacao-imovel': 'Portal da Negociação',
  'requerimentos-imovel': 'Requerimentos',
};

interface EmpresaServicoPageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function EmpresaServicoPage({
  params,
}: EmpresaServicoPageProps) {
  const { serviceId } = await params;
  const title = empresaServiceTitles[serviceId];

  if (!title) {
    notFound();
  }

  return (
    <main className='min-h-screen w-full px-6 py-10 lg:px-10'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <h1 className='text-2xl font-bold sm:text-3xl'>{title}</h1>

        <div className='flex min-h-105 w-full items-center justify-center rounded-xl border-2 border-primary p-6'>
          <span className='text-sm text-muted-foreground'>
            Espaço reservado para iframe
          </span>
        </div>
      </div>
    </main>
  );
}
