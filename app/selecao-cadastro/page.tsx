"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { filtrarCadastros, getCadastros } from "@/lib/mock-cadastros";
import FiltroCadastro, { TODOS } from "./components/filtro-cadastro";
import SidebarSelecao from "./components/sidebar-selecao";
import TabelaCadastros from "./components/tabela-cadastros";

export default function SelecaoCadastroPage() {
  const router = useRouter();
  const [cadastroFiltro, setCadastroFiltro] = useState(TODOS);
  const [textoFiltro, setTextoFiltro] = useState("");
  const [pesquisa, setPesquisa] = useState({ cadastro: TODOS, texto: "" });
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const cadastros = useMemo(() => {
    const cadastro =
      pesquisa.cadastro === TODOS ? undefined : pesquisa.cadastro;
    return filtrarCadastros({ cadastro, texto: pesquisa.texto });
  }, [pesquisa]);

  const cadastroSelecionado = getCadastros().find(
    (item) => item.id === selecionado,
  );

  function handlePesquisar() {
    setPesquisa({ cadastro: cadastroFiltro, texto: textoFiltro });
  }

  function handleSelecionar() {
    if (!cadastroSelecionado) return;

    const params = new URLSearchParams({
      cadastro:
        cadastroSelecionado.cadastro === "Imóvel" ? "imovel" : "cpf-cnpj",
      inscricao: cadastroSelecionado.inscricaoMunicipal,
    });

    router.push(`/negociacao?${params.toString()}`);
  }

  return (
    <main className="flex min-h-[calc(100vh-82px)] flex-col bg-sand md:flex-row">
      <SidebarSelecao />

      <div className="mx-auto w-full max-w-360 flex-1 px-4 py-8 md:px-10 md:py-10">
        <h1 className="m-0 mb-6 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-ink uppercase">
          Selecionar cadastro
        </h1>

        <div className="mb-6">
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
          selecionado={selecionado}
          onSelecionar={setSelecionado}
        />

        <div className="mt-6">
          <Button
            type="button"
            disabled={!cadastroSelecionado}
            onClick={handleSelecionar}
            className="w-full bg-[#2e9e5b] hover:bg-[#268049] md:w-auto"
          >
            Selecionar
          </Button>
        </div>
      </div>
    </main>
  );
}
