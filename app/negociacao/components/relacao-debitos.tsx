'use client';

import { useMemo, useState } from 'react';
import type { Debito } from '@/lib/mock-debitos';
import { getDividasNaoParcelaveis } from '@/lib/mock-debitos';
import FiltroDebitos, { TODOS, type DateRange } from './filtro-debitos';
import TabelaDebitos from './tabela-debitos';
import CartoesDebitos from './cartoes-debitos';
import LegendaSituacao from './legenda-situacao';
import ResumoSelecao from './resumo-selecao';
import SimulacaoPanel from './simulacao-panel';
import FormularioConfirmacao from './formulario-confirmacao';

interface RelacaoDebitosProps {
  debitos: Debito[];
}

export default function RelacaoDebitos({ debitos }: RelacaoDebitosProps) {
  const [tributosSelecionados, setTributosSelecionados] = useState([TODOS]);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState([TODOS]);
  const [vencimentoSelecionado, setVencimentoSelecionado] = useState<DateRange>(
    {},
  );
  const [filtroAplicado, setFiltroAplicado] = useState({
    tributos: [TODOS],
    exercicios: [TODOS],
    vencimento: {} as DateRange,
  });
  const [selecionados, setSelecionados] = useState<Set<string>>(
    () => new Set(debitos.map((debito) => debito.id)),
  );

  const tributos = useMemo(
    () => Array.from(new Set(debitos.map((debito) => debito.tributo))),
    [debitos],
  );
  const exercicios = useMemo(
    () => Array.from(new Set(debitos.map((debito) => debito.exercicio))).sort(),
    [debitos],
  );

  const debitosFiltrados = useMemo(
    () =>
      debitos.filter((debito) => {
        const passaTributo =
          filtroAplicado.tributos.includes(TODOS) ||
          filtroAplicado.tributos.includes(debito.tributo);
        const passaExercicio =
          filtroAplicado.exercicios.includes(TODOS) ||
          filtroAplicado.exercicios.includes(String(debito.exercicio));
        const passaVencimento =
          (!filtroAplicado.vencimento.from ||
            debito.vencimento >= filtroAplicado.vencimento.from) &&
          (!filtroAplicado.vencimento.to ||
            debito.vencimento <= filtroAplicado.vencimento.to);
        return passaTributo && passaExercicio && passaVencimento;
      }),
    [debitos, filtroAplicado],
  );

  const debitosSelecionados = useMemo(
    () => debitos.filter((debito) => selecionados.has(debito.id)),
    [debitos, selecionados],
  );
  const todosDebitosFiltradosSelecionados =
    debitosFiltrados.length > 0 &&
    debitosFiltrados.every((debito) => selecionados.has(debito.id));

  const dividasNaoParcelaveis = useMemo(() => getDividasNaoParcelaveis(), []);

  function handleToggle(id: string) {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) {
        proximo.delete(id);
      } else {
        proximo.add(id);
      }
      return proximo;
    });
  }

  function handleToggleAll() {
    if (debitosFiltrados.length === 0) {
      return;
    }

    setSelecionados((atual) => {
      const proximo = new Set(atual);
      const idsFiltrados = debitosFiltrados.map((debito) => debito.id);
      const deveSelecionar = idsFiltrados.some((id) => !proximo.has(id));

      idsFiltrados.forEach((id) => {
        if (deveSelecionar) {
          proximo.add(id);
        } else {
          proximo.delete(id);
        }
      });

      return proximo;
    });
  }

  return (
    <div className='grid gap-7'>
      <FiltroDebitos
        tributos={tributos}
        exercicios={exercicios}
        tributosSelecionados={tributosSelecionados}
        exerciciosSelecionados={exerciciosSelecionados}
        vencimentoSelecionado={vencimentoSelecionado}
        onTributoChange={setTributosSelecionados}
        onExercicioChange={setExerciciosSelecionados}
        onVencimentoChange={setVencimentoSelecionado}
        onPesquisar={() =>
          setFiltroAplicado({
            tributos: tributosSelecionados,
            exercicios: exerciciosSelecionados,
            vencimento: vencimentoSelecionado,
          })
        }
      />

      <div className='hidden md:block'>
        <TabelaDebitos
          debitos={debitosFiltrados}
          selecionados={selecionados}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          todosSelecionados={todosDebitosFiltradosSelecionados}
        />
      </div>
      <div className='block md:hidden'>
        <CartoesDebitos
          debitos={debitosFiltrados}
          selecionados={selecionados}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          todosSelecionados={todosDebitosFiltradosSelecionados}
        />
      </div>

      <LegendaSituacao />

      <ResumoSelecao
        todos={debitos}
        selecionados={debitosSelecionados}
        dividasNaoParcelaveis={dividasNaoParcelaveis}
      />

      <SimulacaoPanel selecionados={debitosSelecionados} />

      <FormularioConfirmacao podeEnviar={debitosSelecionados.length > 0} />
    </div>
  );
}
