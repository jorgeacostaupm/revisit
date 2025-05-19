import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import {
  originAccessor, destinationAccessor, meanAccessor, stdAccessor,
} from '../utils/Accessors';
import { useMatrixContext } from '../utils/MatrixContext';
import { Link } from '../utils/Interfaces';

export function EncodedCells() {
  const {
    data,

    cellSize,
    cellRenderer,

    originScale,
    destinationScale,
  } = useMatrixContext();

  const ref = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const g = d3
      .select(ref.current)
      .selectAll<SVGGElement, Link>('.cell')
      .data(
        data,
        (d) => originAccessor(d) + destinationAccessor(d) + meanAccessor(d) + stdAccessor(d),
      )
      .join(
        (enter) => enter
          .append('g')
          .attr('class', 'cell')
          .attr(
            'transform',
            (d: Link) => `translate(${originScale(originAccessor(d))}, ${destinationScale(
              destinationAccessor(d),
            )})`,
          ),
        (update) => {
          update.selectAll('*').remove();
          return update.attr(
            'transform',
            (d: Link) => `translate(${originScale(originAccessor(d))}, ${destinationScale(
              destinationAccessor(d),
            )})`,
          );
        },
        (exit) => exit.remove(),
      );

    cellRenderer(g, cellSize);
  }, [data, originScale, destinationScale, cellRenderer, ref, cellSize]);

  return <g ref={ref} />;
}
