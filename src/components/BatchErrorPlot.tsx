import { useEffect, useId, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { gsap } from 'gsap';
import './BatchErrorPlot.css';

/** Hold the tutorial's batch A fixed; vary the single prediction in batch B. */
export default function BatchErrorPlot() {
  const [prediction, predict] = useState(11);
  const id = useId();
  const bars = useRef<SVGSVGElement>(null);
  const errorB = Math.abs(prediction - 7);
  const values = [1, errorB, (1 + errorB) / 2];
  const width = scaleLinear().domain([0, 8]).range([0, 160]);
  useEffect(() => {
    if (!bars.current) return;
    const nodes = bars.current.querySelectorAll('rect');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tween = gsap.to(nodes, { attr: { width: (_, node: SVGRectElement) => Number(node.dataset.width) }, duration: reduce ? 0 : 0.2, overwrite: true });
    return () => { tween.kill(); };
  }, [prediction]);
  return <figure className="batch-plot">
    <figcaption><strong>Try another prediction</strong><br/>Batch B’s observed yield is 7%. Move its predicted yield and compare the errors.</figcaption>
    <label htmlFor={id}>Predicted yield for B: <strong>{prediction}%</strong></label>
    <input id={id} type="range" min="0" max="15" step="1" value={prediction} onChange={e => predict(Number(e.target.value))} />
    <svg ref={bars} viewBox="0 0 325 85" role="img" aria-label={`Mean absolute error in percentage points: batch A 1, batch B ${errorB}, macro average ${values[2]}.`}>
      {['Batch A', 'Batch B', 'Macro MAE'].map((name, i) => <g key={name} transform={`translate(0 ${i * 28})`}>
        <text x="0" y="17">{name}</text><rect x="95" y="5" height="13" rx="3" width={[20,80,50][i]} data-width={width(values[i])}/><text x="270" y="17">{values[i].toFixed(1)}</text>
      </g>)}
    </svg>
    <small>Units: percentage points. Each batch contributes equally to macro MAE.</small>
  </figure>;
}
