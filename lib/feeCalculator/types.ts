export interface PropertyTypeRate {
  key: string;
  label: string;
  baseFee: number;
}

export interface ComplexityFactor {
  key: string;
  label: string;
  amount: number;
}

export interface RushOption {
  key: string;
  label: string;
  percent: number;
}

export interface FeeRateCard {
  propertyTypes: PropertyTypeRate[];
  perSqftThreshold: number;
  perSqftIncrement: number;
  perSqftFee: number;
  complexityFactors: ComplexityFactor[];
  rushOptions: RushOption[];
}
