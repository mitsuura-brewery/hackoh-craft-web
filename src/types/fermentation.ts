export type MaterialCategory = 'protein' | 'koji';

export interface MaterialParameters {
  protein?: number;
  salt?: number;
  enzyme?: number;
  moisture?: number;
}

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  icon: string;
  thumbnail: string;
  description: string;
  parameters: MaterialParameters;
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
  fermentationPeriod: number;
  nutritionFacts: NutritionFacts;
  createdAt: Date;
}

export interface SeasonalTemperature {
  spring: number;
  summer: number;
  autumn: number;
  winter: number;
}

export interface FermentationCalculationResult {
  fermentationPeriod: number;
  nutritionFacts: NutritionFacts;
  recommendation: string;
}

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'salted-soybean-paste',
    name: '塩切り大豆ペースト',
    category: 'protein',
    icon: '🫘',
    thumbnail: '/materials/soybean-paste.jpg',
    description: '大豆を塩で調味したペースト状の発酵素材',
    parameters: {
      protein: 15.2,
      salt: 12.5,
      moisture: 55.0
    }
  },
  {
    id: 'salted-chickpea-paste',
    name: '塩切りひよこ豆ペースト',
    category: 'protein',
    icon: '🌰',
    thumbnail: '/materials/chickpea-paste.jpg',
    description: 'ひよこ豆を塩で調味したペースト状の発酵素材',
    parameters: {
      protein: 12.8,
      salt: 11.0,
      moisture: 58.0
    }
  },
  {
    id: 'rice-koji',
    name: '米麹',
    category: 'koji',
    icon: '🌾',
    thumbnail: '/materials/rice-koji.jpg',
    description: '米を麹菌で発酵させた発酵触媒',
    parameters: {
      enzyme: 8.5,
      moisture: 28.0
    }
  },
  {
    id: 'barley-koji',
    name: '麦麹',
    category: 'koji',
    icon: '🌾',
    thumbnail: '/materials/barley-koji.jpg',
    description: '麦を麹菌で発酵させた発酵触媒',
    parameters: {
      enzyme: 7.2,
      moisture: 32.0
    }
  }
];

export const SEASONAL_TEMPERATURES: SeasonalTemperature = {
  spring: 18,
  summer: 28,
  autumn: 22,
  winter: 12
};

export const getCurrentSeason = (): keyof SeasonalTemperature => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};