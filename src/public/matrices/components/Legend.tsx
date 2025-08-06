import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Text } from '@mantine/core';

import { meanAccessor, stdAccessor } from '../utils/Accessors';
import { useMatrixContext } from '../utils/MatrixContext';
import { Link } from '../utils/Interfaces';
import { EncodingType } from '../utils/Enums';

const marginBivariate = 80;
const meanText = 'Price Ranges (in $):';
const devText = 'Price Variation Ranges (in $):';

export function Legend() {
  const {
    cellRenderer, cellSize, meanScale, devScale, configProps,
  } = useMatrixContext();
  const { encoding } = configProps;

  const legendCellSize = cellSize;

  const meanRef = useRef<SVGGElement | null>(null);
  const devRef = useRef<SVGGElement | null>(null);
  const makeLegendData = useCallback(
    (scale: d3.ScaleQuantize<number | string, never>, isMean: boolean): Link[] => scale.range().map((color) => {
      const [min, max] = scale.invertExtent(color);
      return {
        mean: isMean ? (min + max) / 2 : 0,
        std: !isMean ? (min + max) / 2 : 0,
        origin: '',
        destination: '',
      };
    }),
    [],
  );

  const drawLegend = useCallback(
    (
      ref: React.RefObject<SVGGElement | null>,
      legendData: Link[],
      scale: d3.ScaleQuantize<number | string, never>,
      showMean: boolean,
      showDev: boolean,
    ) => {
      const g = ref.current;
      if (!g) return;

      const group = d3.select(g);
      group.selectAll('*').remove();

      const margin = Math.max(legendCellSize + 20, 70);

      const cells = group
        .selectAll<SVGGElement, Link>('.cell')
        .data(legendData, (d) => meanAccessor(d) + stdAccessor(d))
        .enter()
        .append('g')
        .attr('class', 'cell')
        .attr('transform', (_, i) => `translate(${margin * i}, 0)`);

      cells
        .append('text')
        .attr('transform', `translate(${legendCellSize / 2}, ${legendCellSize + 20})`)
        .attr('text-anchor', 'middle')
        .text((_, i) => {
          const [min, max] = scale.invertExtent(scale.range()[i]);
          if (i + 1 === scale.range().length) return `${min.toFixed(0)}-${+max.toFixed(0)}`;
          return `${min.toFixed(0)}-${+max.toFixed(0) - 1}`;
        });

      cellRenderer(group.selectAll('.cell'), legendCellSize, showMean, showDev);
    },
    [cellRenderer, legendCellSize],
  );

  const makeLightnessLegendData = useCallback(
    (
      mScale: d3.ScaleQuantize<number | string, never>,
      dScale: d3.ScaleQuantize<number | string, never>,
    ): Link[] => {
      const data: Link[] = [];
      mScale.range().forEach((mExtent, i) => {
        const [mMin, mMax] = meanScale.invertExtent(mExtent);
        dScale.range().forEach((dExtent, j) => {
          const [dMin, dMax] = devScale.invertExtent(dExtent);

          const item = {
            mean: (mMin + mMax) / 2,
            std: (dMin + dMax) / 2,
            origin: `${i}`,
            destination: `${j}`,
          };

          data.push(item);
        });
      });
      return data;
    },

    [meanScale, devScale],
  );

  const drawLightnessLegend = useCallback(
    (
      ref: React.RefObject<SVGGElement | null>,
      legendData: Link[],
      mScale: d3.ScaleQuantize<number | string, never>,
      dScale: d3.ScaleQuantize<number | string, never>,
      showMean: boolean,
      showDev: boolean,
    ) => {
      const g = ref.current;
      if (!g) return;

      const cellSizeL = legendCellSize;

      const group = d3.select(g);
      group.selectAll('*').remove();

      group
        .selectAll<SVGGElement, Link>('.cell')
        .data(legendData, (d) => meanAccessor(d) + stdAccessor(d))
        .join('g')
        .attr('class', 'cell')
        .attr(
          'transform',
          (d) => `translate(${cellSizeL * +d.origin}, ${cellSizeL * +d.destination + marginBivariate})`,
        );

      group
        .selectAll<SVGGElement, Link>('.meanLabel')
        .data(mScale.range())
        .join('text')
        .attr(
          'transform',
          (d, i) => `translate(${cellSizeL * i + 15}, ${marginBivariate - 5})rotate(-45)`,
        )
        .attr('text-anchor', 'start')
        .text((d, i) => {
          const [min, max] = mScale.invertExtent(d);
          if (i + 1 === mScale.range().length) return `${min.toFixed(0)} - ${+max.toFixed(0)}`;
          return `${min.toFixed(0)} - ${+max.toFixed(0)}`;
        });

      group
        .selectAll<SVGGElement, Link>('.devLabel')
        .data(dScale.range())
        .join('text')
        .attr(
          'transform',
          (d, i) => `translate(${mScale.range().length * cellSizeL + 5},${
            cellSizeL * i + marginBivariate + cellSizeL / 2 + 5
          })`,
        )
        .attr('text-anchor', 'start')
        .text((d, i) => {
          const [min, max] = dScale.invertExtent(d);
          if (i + 1 === dScale.range().length) return `${min.toFixed(0)} - ${+max.toFixed(0)}`;
          return `${min.toFixed(0)} - ${+max.toFixed(0)}`;
        });

      cellRenderer(group.selectAll('.cell'), cellSizeL, showMean, showDev);
    },
    [legendCellSize, cellRenderer],
  );

  useEffect(() => {
    if (meanRef.current && encoding !== EncodingType.Bivariate) {
      const meanLegend = makeLegendData(meanScale, true);
      drawLegend(meanRef, meanLegend, meanScale, true, false);
    }
  }, [meanScale, encoding, drawLegend, makeLegendData]);

  useEffect(() => {
    if (devRef.current && encoding !== EncodingType.Bivariate) {
      const devLegend = makeLegendData(devScale, false);
      drawLegend(devRef, devLegend, devScale, false, true);
    }
  }, [devScale, encoding, drawLegend, makeLegendData]);

  useEffect(() => {
    if (meanRef.current && encoding === EncodingType.Bivariate) {
      const data = makeLightnessLegendData(meanScale, devScale);
      drawLightnessLegend(meanRef, data, meanScale, devScale, true, true);
    }
  }, [encoding, meanScale, devScale, drawLightnessLegend, makeLightnessLegendData]);

  return (
    <>
      <div style={{ width: '100%' }}>
        <Text size="xl" fw={700} style={{ marginBottom: '20px' }}>
          {meanText}
        </Text>
        <svg
          width="100%"
          overflow="visible"
          height={
            encoding !== EncodingType.Bivariate
              ? legendCellSize * 2
              : Math.min(legendCellSize + 30, 60) * 7
          }
        >
          <g ref={meanRef} />
        </svg>
      </div>

      {devScale.range().length > 1 && encoding !== EncodingType.Bivariate && (
        <div>
          <Text size="xl" fw={700} style={{ marginBottom: '20px' }}>
            {devText}
          </Text>
          <svg overflow="visible" height={legendCellSize * 2} width="100%">
            <g ref={devRef} />
          </svg>
        </div>
      )}
    </>
  );
}
