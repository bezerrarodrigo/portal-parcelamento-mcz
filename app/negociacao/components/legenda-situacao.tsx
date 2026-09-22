import { getLegendaSituacoes } from '@/lib/mock-debitos';

export default function LegendaSituacao() {
  const legenda = getLegendaSituacoes();
  const entradas = Object.entries(legenda);

  return (
    <p className='text-[0.76rem] leading-[1.6] text-ink-soft'>
      <strong>Legenda situação: </strong>
      {entradas.map(([codigo, descricao], index) => (
        <span key={codigo}>
          <strong>{codigo}</strong> - {descricao}
          {index < entradas.length - 1 ? ' | ' : ''}
        </span>
      ))}
    </p>
  );
}
