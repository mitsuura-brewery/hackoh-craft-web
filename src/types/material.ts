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
  // 麹のみの酵素力価（オプション）
  alphaAmylase?: number; // αアミラーゼ
  glucoAmylase?: number; // グルコアミラーゼ
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

// 麹の酵素力価データ
export const KOJI_ENZYME_DATA = {
  rice: { alphaAmylase: 100, glucoAmylase: 100 },
  barley: { alphaAmylase: 56.8, glucoAmylase: 45.3 }
} as const;

// プロテアーゼ活性値の表データ（pH別）
export const PROTEASE_ACTIVITY_TABLE = {
  rice: {
    3.0: 130.2, 3.5: 125.1, 4.0: 120.2, 4.5: 115.1, 5.0: 110,
    5.5: 105.1, 6.0: 100, 6.5: 73, 7.0: 46, 7.5: 19
  },
  barley: {
    3.0: 181, 3.5: 177.6, 4.0: 174.3, 4.5: 170.3, 5.0: 166.2,
    5.5: 161.9, 6.0: 157.1, 6.5: 98.9, 7.0: 52.2, 7.5: 17.5
  }
} as const;

// 線形補間によるプロテアーゼ活性値の計算
export const calculateProteaseActivity = (kojiType: 'rice' | 'barley', pH: number): number => {
  const table = PROTEASE_ACTIVITY_TABLE[kojiType];
  const pHValues = Object.keys(table).map(Number).sort((a, b) => a - b);
  
  // pH範囲チェック
  if (pH <= pHValues[0]) return table[pHValues[0] as keyof typeof table];
  if (pH >= pHValues[pHValues.length - 1]) return table[pHValues[pHValues.length - 1] as keyof typeof table];
  
  // 線形補間
  for (let i = 0; i < pHValues.length - 1; i++) {
    const pH1 = pHValues[i];
    const pH2 = pHValues[i + 1];
    
    if (pH >= pH1 && pH <= pH2) {
      const value1 = table[pH1 as keyof typeof table];
      const value2 = table[pH2 as keyof typeof table];
      
      // 線形補間の式: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
      return value1 + (pH - pH1) * (value2 - value1) / (pH2 - pH1);
    }
  }
  
  return 0;
};
