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
  const [tributoSelecionado, setTributoSelecionado] = useState(TODOS);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(TODOS);
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
          tributoSelecionado === TODOS || debito.tributo === tributoSelecionado;
        const passaExercicio =
          exercicioSelecionado === TODOS ||
          String(debito.exercicio) === exercicioSelecionado;
        return passaTributo && passaExercicio;
      }),
    [debitos, tributoSelecionado, exercicioSelecionado],
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
        tributoSelecionado={tributoSelecionado}
        exercicioSelecionado={exercicioSelecionado}
        onTributoChange={setTributoSelecionado}
        onExercicioChange={setExercicioSelecionado}
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
