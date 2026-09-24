'use client';

import { useMemo, useState } from 'react';
import type { Debito } from '@/lib/mock-debitos';
import { getDividasNaoParcelaveis } from '@/lib/mock-debitos';
import FiltroDebitos, { TODOS } from './filtro-debitos';
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
  const [filtroAplicado, setFiltroAplicado] = useState({
    tributos: [TODOS],
    exercicios: [TODOS],
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
        return passaTributo && passaExercicio;
      }),
    [debitos, filtroAplicado],
  );

  const debitosSelecionados = useMemo(
    () => debitos.filter((debito) => selecionados.has(debito.id)),
    [debitos, selecionados],
  );

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

  return (
    <div className='grid gap-7'>
      <FiltroDebitos
        tributos={tributos}
        exercicios={exercicios}
        tributosSelecionados={tributosSelecionados}
        exerciciosSelecionados={exerciciosSelecionados}
        onTributoChange={setTributosSelecionados}
        onExercicioChange={setExerciciosSelecionados}
        onPesquisar={() =>
          setFiltroAplicado({
            tributos: tributosSelecionados,
            exercicios: exerciciosSelecionados,
          })
        }
      />

      <div className='hidden md:block'>
        <TabelaDebitos
          debitos={debitosFiltrados}
          selecionados={selecionados}
          onToggle={handleToggle}
        />
      </div>
      <div className='block md:hidden'>
        <CartoesDebitos
          debitos={debitosFiltrados}
          selecionados={selecionados}
          onToggle={handleToggle}
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
