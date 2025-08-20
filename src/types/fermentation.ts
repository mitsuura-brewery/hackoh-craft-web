export type MaterialCategory = 'protein' | 'koji';

export interface MaterialParameters {
  protein?: number;
  salt?: number;
  enzyme?: number;
  moisture?: number;
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
    shortName: '大豆',
    category: 'protein',
    icon: '/img/soy.png',
    thumbnail: '/materials/soybean-paste.jpg',
    description: '大豆を塩で調味したペースト状の発酵素材',
    parameters: {
      protein: 15.2,
      salt: 12.5,
      moisture: 55.0,
    },
    colors: {
      primary: '#f8cc99', // 大豆ベース色
      light: '#fce8d1', // 淡い大豆色
      background: '#f8cc99', // 背景用
      border: '#e6b17a', // 濃い大豆色
    },
    shopifyVariantId: '45123752296604',
  },
  {
    id: 'salted-chickpea-paste',
    name: '塩切りひよこ豆ペースト',
    shortName: 'ひよこ豆',
    category: 'protein',
    icon: '/img/chickpeas.png',
    thumbnail: '/materials/chickpea-paste.jpg',
    description: 'ひよこ豆を塩で調味したペースト状の発酵素材',
    parameters: {
      protein: 12.8,
      salt: 11.0,
      moisture: 58.0,
    },
    colors: {
      primary: '#f4e654', // ひよこ豆ベース色
      light: '#f9f19e', // 淡いひよこ豆色
      background: '#f4e654', // 背景用
      border: '#e0cf2a', // 濃いひよこ豆色
    },
    shopifyVariantId: '45123753115804',
  },
  {
    id: 'rice-koji',
    name: '米麹',
    shortName: '米麹',
    category: 'koji',
    icon: '/img/rice.png',
    thumbnail: '/materials/rice-koji.jpg',
    description: '米を麹菌で発酵させた発酵触媒',
    parameters: {
      enzyme: 8.5,
      moisture: 28.0,
    },
    colors: {
      primary: '#d0e4e8', // 米麹ベース色
      light: '#e8f4f6', // 淡い米麹色
      background: '#d0e4e8', // 背景用
      border: '#b8d1d6', // 濃い米麹色
    },
    shopifyVariantId: '45123754885276',
  },
  {
    id: 'barley-koji',
    name: '麦麹',
    shortName: '麦麹',
    category: 'koji',
    icon: '/img/wheat.png',
    thumbnail: '/materials/barley-koji.jpg',
    description: '麦を麹菌で発酵させた発酵触媒',
    parameters: {
      enzyme: 7.2,
      moisture: 32.0,
    },
    colors: {
      primary: '#e8c794', // 麦麹ベース色（白寄りに調整）
      light: '#d4944a', // 淡い麦麹色
      background: '#b46c1f', // 背景用
      border: '#9a5a18', // 濃い麦麹色
    },
    shopifyVariantId: '45123755770012',
  },
];

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
