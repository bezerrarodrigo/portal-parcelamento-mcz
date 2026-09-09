import { notFound } from 'next/navigation';

const cidadaoServiceTitles: Record<string, string> = {
  guia: 'Extrato Guia',
  certidao: 'Certidão Financeira Pessoa',
  imovel: 'Certidão Financeira Imóvel',
  baixa: 'Certidão Baixa de Inscrição Municipal',
  comprovante: 'Comprovante de Inscrição e de Situação Cadastral',
  autenticidade: 'Autenticidade Certidão',
  cadastro: 'Ficha Cadastral Imóvel',
  economico: 'Indicador Econômico',
};

interface CidadaoServicoPageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function CidadaoServicoPage({
  params,
}: CidadaoServicoPageProps) {
  const { serviceId } = await params;
  const title = cidadaoServiceTitles[serviceId];

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
