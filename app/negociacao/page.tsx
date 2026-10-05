import { obterOpcoesParcelamento } from '@/lib/api/parcelamentos';
import type { DadosGuia } from '@/lib/api/guia-contrato';
import type { Debito } from '@/lib/mock-debitos';
import { getDebitosPorInscricao } from '@/lib/mock-debitos';
import SidebarNavegacao from '../components/sidebar-navegacao';
import RelacaoDebitos from './components/relacao-debitos';

interface NegociacaoPageProps {
  searchParams: Promise<{
    cadastro?: string;
    inscricao?: string;
    mode?: string;
    id?: string;
    regraId?: string;
  }>;
}

export default async function NegociacaoPage({
  searchParams,
}: NegociacaoPageProps) {
  const { cadastro, inscricao, mode, id, regraId } = await searchParams;
  let debitos: Debito[] = [];
  let nomeRegra: string | null = null;
  let guia: DadosGuia | undefined;
  let erro: string | null = null;
  const fluxoApi = Boolean(id || regraId);

  if (fluxoApi) {
    if (!id || !regraId) {
      erro = 'Não foi possível identificar o cadastro ou a regra selecionada.';
    } else {
      try {
        const opcoes = await obterOpcoesParcelamento(id);
        const opcao = opcoes.find((item) => item.id === regraId);

        if (!opcao) {
          throw new Error('A regra selecionada não está mais disponível.');
        }

        debitos = opcao.parcelas;
        nomeRegra = opcao.nome;
        guia = opcao.guia;
      } catch (error) {
        erro =
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os débitos da regra selecionada.';
      }
    }
  } else {
    debitos = getDebitosPorInscricao(inscricao ?? '');
  }

  const modalidadeSelecionada =
    mode === 'vista' ? 'À vista' : mode === 'parcelado' ? 'Parcelado' : null;

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarNavegacao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10'>
        <p className='mb-3.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-orange uppercase'>
          Negociação de débitos
        </p>
        <h1 className='m-0 text-[clamp(1.6rem,3vw,2.1rem)] tracking-[-0.02em] text-ink'>
          Relação de débitos
        </h1>
        {erro ? (
          <p role='alert' className='mt-4 border border-line bg-white p-5 text-ink'>
            {erro}
          </p>
        ) : (
          <>
            <p className='mt-2 mb-8 text-ink-soft'>
              Cadastro: {cadastro === 'imovel' ? 'Imóvel' : 'CPF/CNPJ'} ·
              Inscrição municipal: {inscricao || 'não informada'}
              {nomeRegra && ` · Regra: ${nomeRegra}`}
              {!nomeRegra &&
                modalidadeSelecionada &&
                ` · Opção selecionada: ${modalidadeSelecionada}`}
            </p>

            <RelacaoDebitos
              debitos={debitos}
              guia={guia}
              dividasNaoParcelaveis={fluxoApi ? [] : undefined}
            />
          </>
        )}
      </div>
    </main>
  );
}
