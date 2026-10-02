'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { listarCadastrosPorCpfCnpj } from '@/lib/api/cadastros';
import { isValidCpfCnpj, onlyDigits } from '@/lib/cpf-cnpj';
import type { Cadastro } from '@/lib/mock-cadastros';
import FiltroCadastro, { TODOS } from './components/filtro-cadastro';

import TabelaCadastros from './components/tabela-cadastros';
import SidebarSelecao from './components/sidebar-selecao';

export default function SelecaoCadastroPage() {
  const router = useRouter();
  const [cadastroFiltro, setCadastroFiltro] = useState(TODOS);
  const [textoFiltro, setTextoFiltro] = useState('');
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const cadastrosFiltrados = useMemo(() => {
    if (cadastroFiltro === TODOS) return cadastros;
    return cadastros.filter((item) => item.cadastro === cadastroFiltro);
  }, [cadastros, cadastroFiltro]);

  const cadastroSelecionado = cadastros.find((item) => item.id === selecionado);

  async function handlePesquisar() {
    const cpfCnpj = onlyDigits(textoFiltro);

    if (!isValidCpfCnpj(cpfCnpj)) {
      toast.error('Informe um CPF/CNPJ válido para pesquisar.');
      return;
    }

    setCarregando(true);
    setSelecionado(null);

    try {
      const resultado = await listarCadastrosPorCpfCnpj(cpfCnpj);
      setCadastros(resultado);

      if (resultado.length === 0) {
        toast.info('Nenhum cadastro encontrado para o CPF/CNPJ informado.');
      }
    } catch (error) {
      setCadastros([]);
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível consultar os cadastros. Tente novamente.';
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  function handleSelecionar() {
    if (!cadastroSelecionado) return;

    const params = new URLSearchParams({
      inscricao: cadastroSelecionado.inscricaoMunicipal,
    });

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarSelecao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10'>
        <h1 className='m-0 mb-6 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-ink uppercase'>
          Selecionar cadastro
        </h1>

        <div className='mb-6'>
          <FiltroCadastro
            cadastro={cadastroFiltro}
            texto={textoFiltro}
            carregando={carregando}
            onCadastroChange={setCadastroFiltro}
            onTextoChange={setTextoFiltro}
            onPesquisar={handlePesquisar}
          />
        </div>

        <TabelaCadastros
          cadastros={cadastrosFiltrados}
          selecionado={selecionado}
          onSelecionar={setSelecionado}
        />

        <div className='mt-6'>
          <Button
            type='button'
            disabled={!cadastroSelecionado}
            onClick={handleSelecionar}
            className='w-full bg-[#2e9e5b] hover:bg-[#268049] md:w-auto'
          >
            Selecionar
          </Button>
        </div>
      </div>
    </main>
  );
}
