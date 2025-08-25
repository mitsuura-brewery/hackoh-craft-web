export type MaterialCategory = 'protein' | 'koji';

export interface MaterialParameters {
  weight: number; // 重量(g)
  moisture: number; // 水分(%)
  moistureAmount: number; // 水分量(g)
  salt: number; // 塩分(%)
  saltAmount: number; // 塩分量(g)
  pH: number; // pH
  protein: number; // たんぱく質(g)
  fat: number; // 脂質(g)
  starch: number; // でんぷん(g)
}

export interface MaterialColors {
  primary: string;
  light: string;
  background: string;
  border: string;
}

export interface Material {
  id: string;
  name: string;
  shortName: string;
  category: MaterialCategory;
  icon: string;
  thumbnail: string;
  description: string;
  parameters: MaterialParameters;
  colors: MaterialColors;
  shopifyVariantId: string;
}

export interface NutritionFacts {
  protein: number;
  carbohydrate: number;
  fat: number;
  sodium: number;
  fiber: number;
  calories: number;
}

export interface Compound {
  id: string;
  materials: Material[];
  materialPeriod: number;
  nutritionFacts: NutritionFacts;
  createdAt: Date;
}

export interface SeasonalTemperature {
  spring: number;
  summer: number;
  autumn: number;
  winter: number;
}

export interface MaterialCalculationResult {
  materialPeriod: number;
  nutritionFacts: NutritionFacts;
  recommendation: string;
}


export const SEASONAL_TEMPERATURES: SeasonalTemperature = {
  spring: 18,
  summer: 28,
  autumn: 22,
  winter: 12,
};

export const getCurrentSeason = (): keyof SeasonalTemperature => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};
