import { getLegendaSituacoes } from '@/lib/mock-debitos';

export default function LegendaSituacao() {
  const legenda = getLegendaSituacoes();
  const entradas = Object.entries(legenda);

  return (
    <p className='debitos-legend'>
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
