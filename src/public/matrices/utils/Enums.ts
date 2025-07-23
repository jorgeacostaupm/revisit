export enum EncodingType {
  Bivariate = 'Bivariate',
  MarkSize = 'Mark Size',
  CellSize = 'Cell Size',
  BarChart = 'Bar Chart',
  BarChartColor = 'Bar Chart + Color Scale',
  MarkAngle45 = 'Mark Angle (0-45)',
  MarkAngle45_90 = 'Mark Angle (45-90)',
  MarkAngle90 = 'Mark Angle (0-90)',
  ColorAngle45 = 'Color+Angle (0-45)',
  ColorAngle90 = 'Color+Angle (0-90)',
  Mean = 'Just the mean',
}

export enum ClusteringMode {
  None = 'none',
  Optimal = 'optimal',
  PCA = 'pca',
}

export enum ClusteringVariable {
  Mean = 'mean',
  StandardDeviation = 'std',
  SignalToNoiseRatio = 'snr',
}

export enum ColorScheme {
  Viridis = 'viridis',
  Cividis = 'cividis',
  Warm = 'warm',
  Cool = 'cool',
  Plasma = 'plasma',
  Inferno = 'inferno',
  Turbo = 'turbo',
  Blues = 'blues',
  Oranges = 'oranges',
  Reds = 'reds',
}

export enum UserActionType {
  ClearNodeSelection = 'Clear State Selection',
  ClearLinkSelection = 'Clear Flight Selection',
  ResetOrdering = 'reset_ordering',
}
