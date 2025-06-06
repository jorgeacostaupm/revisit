import { useState } from 'react';
import {
  ColorScheme, EncodingType, ClusteringMode, ClusteringVariable,
} from '../utils/Enums';
import type { ChartConfiguration, ConfigProps, ExternalParameters } from '../utils/Interfaces';

const DEFAULTS: ChartConfiguration = {
  showConfigurationPanel: false,
  colorScheme: ColorScheme.Viridis,
  markContrast: 0,
  encoding: EncodingType.Mean,
  showTooltip: false,
  isSnr: false,
  clusterMode: ClusteringMode.None,
  clusterVar: ClusteringVariable.Mean,
  nMeans: 5,
  nDevs: 5,
};

const mergeConfig = (
  params: ExternalParameters,
  defaults: ChartConfiguration,
): ChartConfiguration => ({
  ...defaults,
  ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined)),
});

export function useConfigProps(parameters: ExternalParameters): ConfigProps {
  const mergedConfig = mergeConfig(parameters, DEFAULTS);

  const [colorScheme, setColorScheme] = useState<ColorScheme>(mergedConfig.colorScheme);
  const [markContrast, setMarkContrast] = useState(mergedConfig.markContrast);
  const [encoding, setEncoding] = useState<EncodingType>(mergedConfig.encoding);
  const [showTooltip, setShowTooltip] = useState<boolean>(mergedConfig.showTooltip);
  const [isSnr, setIsSnr] = useState<boolean>(mergedConfig.isSnr);
  const [clusterMode, setClusterMode] = useState<ClusteringMode>(mergedConfig.clusterMode);
  const [clusterVar, setClusterVar] = useState<ClusteringVariable>(mergedConfig.clusterVar);
  const [nMeans, setNMeans] = useState<number>(mergedConfig.nMeans);
  const [nDevs, setNDevs] = useState<number>(mergedConfig.nDevs);

  return {
    ...mergedConfig,
    colorScheme,
    markContrast,
    encoding,
    showTooltip,
    isSnr,
    clusterMode,
    clusterVar,
    nMeans,
    nDevs,

    // Setters
    setColorScheme,
    setMarkContrast,
    setEncoding,
    setShowTooltip,
    setIsSnr,
    setClusterMode,
    setClusterVar,
    setNMeans,
    setNDevs,
  };
}
