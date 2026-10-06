'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { listarCadastrosPorCpfCnpj } from '@/lib/api/cadastros';
import type { Cadastro } from '@/lib/mock-cadastros';
import FiltroCadastro, { TODOS } from './components/filtro-cadastro';

import TabelaCadastros from './components/tabela-cadastros';
import SidebarSelecao from './components/sidebar-selecao';

// CPF/CNPJ fixo até a autenticação do usuário estar disponível e fornecer o valor real.
const CPF_CNPJ_AUTENTICADO = '77877877838';

export default function SelecaoCadastroPage() {
  const router = useRouter();
  const [cadastroFiltro, setCadastroFiltro] = useState(TODOS);
  const [textoFiltro, setTextoFiltro] = useState('');
  const [pesquisa, setPesquisa] = useState({ cadastro: TODOS, texto: '' });
  const [todosCadastros, setTodosCadastros] = useState<Cadastro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState<string | null>(null);

  useEffect(() => {
    async function carregarCadastros() {
      setCarregando(true);

      try {
        const resultado = await listarCadastrosPorCpfCnpj(CPF_CNPJ_AUTENTICADO);
        setTodosCadastros(resultado);
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os cadastros. Tente novamente.';
        toast.error(mensagem);
      } finally {
        setCarregando(false);
      }
    }

    carregarCadastros();
  }, []);

  const cadastros = useMemo(() => {
    const termo = pesquisa.texto.trim().toLowerCase();

    return todosCadastros.filter((item) => {
      const combinaCadastro =
        pesquisa.cadastro === TODOS || item.cadastro === pesquisa.cadastro;
      const combinaTexto =
        !termo ||
        item.nomeRazaoSocial.toLowerCase().includes(termo) ||
        item.inscricaoMunicipal.toLowerCase().includes(termo) ||
        (item.cpfCnpj?.toLowerCase().includes(termo) ?? false);

      return combinaCadastro && combinaTexto;
    });
  }, [todosCadastros, pesquisa]);

  const cadastroSelecionado = todosCadastros.find(
    (item) => item.id === selecionado,
  );
  const nomeUsuario = todosCadastros.find(
    (item) => item.nomeRazaoSocial.trim(),
  )?.nomeRazaoSocial.trim();

  function handlePesquisar() {
    setPesquisa({ cadastro: cadastroFiltro, texto: textoFiltro });
  }

  function handleSelecionar() {
    if (!cadastroSelecionado) return;

    const params = new URLSearchParams({
      inscricao: cadastroSelecionado.inscricaoMunicipal,
      id: cadastroSelecionado.id,
    });

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <main className='flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row'>
      <SidebarSelecao />

      <div className='mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10'>
        {nomeUsuario && (
          <p className='mb-2 text-base font-medium text-ink'>
            Olá, {nomeUsuario}!
          </p>
        )}
        <h1 className='m-0 mb-6 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-ink uppercase'>
          Selecionar cadastro
        </h1>

        <div className='mb-6'>
          <FiltroCadastro
            cadastro={cadastroFiltro}
            texto={textoFiltro}
            onCadastroChange={setCadastroFiltro}
            onTextoChange={setTextoFiltro}
            onPesquisar={handlePesquisar}
          />
        </div>

        <TabelaCadastros
          cadastros={cadastros}
          carregando={carregando}
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
