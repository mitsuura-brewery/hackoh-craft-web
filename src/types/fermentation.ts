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
    id: 'soybean',
    name: '大豆',
    shortName: '大豆',
    category: 'protein',
    icon: '/img/soy.png',
    thumbnail: '/materials/soybean.jpg',
    description: '大豆を使用した発酵素材',
    parameters: {
      weight: 760,
      moisture: 54.0,
      moistureAmount: 410.4,
      salt: 15.5,
      saltAmount: 117.8,
      pH: 6.3,
      protein: 98.2,
      fat: 54.5,
      starch: 81.8,
    },
    colors: {
      primary: '#f8cc99',
      light: '#fce8d1',
      background: '#f8cc99',
      border: '#e6b17a',
    },
    shopifyVariantId: '45123752296604',
  },
  {
    id: 'chickpea',
    name: 'ひよこ豆',
    shortName: 'ひよこ豆',
    category: 'protein',
    icon: '/img/chickpeas.png',
    thumbnail: '/materials/chickpea.jpg',
    description: 'ひよこ豆を使用した発酵素材',
    parameters: {
      weight: 760,
      moisture: 54.0,
      moistureAmount: 410.4,
      salt: 15.5,
      saltAmount: 117.8,
      pH: 6.4,
      protein: 54.5,
      fat: 16.4,
      starch: 122.7,
    },
    colors: {
      primary: '#f4e654',
      light: '#f9f19e',
      background: '#f4e654',
      border: '#e0cf2a',
    },
    shopifyVariantId: '45123753115804',
  },
  // {
  //   id: 'lentil',
  //   name: 'レンズ豆',
  //   shortName: 'レンズ豆',
  //   category: 'protein',
  //   icon: '/img/lentil.png',
  //   thumbnail: '/materials/lentil.jpg',
  //   description: 'レンズ豆を使用した発酵素材',
  //   parameters: {
  //     weight: 760,
  //     moisture: 54.00,
  //     moistureAmount: 410.4,
  //     salt: 15.50,
  //     saltAmount: 117.8,
  //     pH: 6.3,
  //     protein: 68.2,
  //     fat: 2.7,
  //     starch: 130.9,
  //   },
  //   colors: {
  //     primary: '#c97a32',
  //     light: '#e8b473',
  //     background: '#c97a32',
  //     border: '#a86429',
  //   },
  //   shopifyVariantId: '45123756000000',
  // },
  // {
  //   id: 'broad-bean',
  //   name: 'そら豆',
  //   shortName: 'そら豆',
  //   category: 'protein',
  //   icon: '/img/broad-bean.png',
  //   thumbnail: '/materials/broad-bean.jpg',
  //   description: 'そら豆を使用した発酵素材',
  //   parameters: {
  //     weight: 760,
  //     moisture: 54.00,
  //     moistureAmount: 410.4,
  //     salt: 15.50,
  //     saltAmount: 117.8,
  //     pH: 6.5,
  //     protein: 70.9,
  //     fat: 5.5,
  //     starch: 122.7,
  //   },
  //   colors: {
  //     primary: '#6ba642',
  //     light: '#9ec470',
  //     background: '#6ba642',
  //     border: '#588537',
  //   },
  //   shopifyVariantId: '45123756000001',
  // },
  // {
  //   id: 'kidney-bean',
  //   name: 'インゲン豆',
  //   shortName: 'インゲン豆',
  //   category: 'protein',
  //   icon: '/img/kidney-bean.png',
  //   thumbnail: '/materials/kidney-bean.jpg',
  //   description: 'インゲン豆を使用した発酵素材',
  //   parameters: {
  //     weight: 760,
  //     moisture: 54.00,
  //     moistureAmount: 410.4,
  //     salt: 15.50,
  //     saltAmount: 117.8,
  //     pH: 6.2,
  //     protein: 60.0,
  //     fat: 2.7,
  //     starch: 150.0,
  //   },
  //   colors: {
  //     primary: '#8b4513',
  //     light: '#cd853f',
  //     background: '#8b4513',
  //     border: '#654321',
  //   },
  //   shopifyVariantId: '45123756000002',
  // },
  // {
  //   id: 'tuna',
  //   name: 'ツナ',
  //   shortName: 'ツナ',
  //   category: 'protein',
  //   icon: '/img/tuna.png',
  //   thumbnail: '/materials/tuna.jpg',
  //   description: 'ツナを使用した発酵素材',
  //   parameters: {
  //     weight: 760,
  //     moisture: 54.00,
  //     moistureAmount: 410.4,
  //     salt: 15.50,
  //     saltAmount: 117.8,
  //     pH: 6.1,
  //     protein: 218.2,
  //     fat: 16.4,
  //     starch: 0.0,
  //   },
  //   colors: {
  //     primary: '#ff6b6b',
  //     light: '#ff9999',
  //     background: '#ff6b6b',
  //     border: '#e55555',
  //   },
  //   shopifyVariantId: '45123756000003',
  // },
  {
    id: 'rice-koji',
    name: '米麹',
    shortName: '米麹',
    category: 'koji',
    icon: '/img/rice.png',
    thumbnail: '/materials/rice-koji.jpg',
    description: '米を麹菌で発酵させた発酵触媒',
    parameters: {
      weight: 270,
      moisture: 15.0,
      moistureAmount: 40.5,
      salt: 0.0,
      saltAmount: 0.0,
      pH: 6.2,
      protein: 18.3,
      fat: 4.1,
      starch: 204.5,
    },
    colors: {
      primary: '#d0e4e8',
      light: '#e8f4f6',
      background: '#d0e4e8',
      border: '#b8d1d6',
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
      weight: 270,
      moisture: 15.0,
      moistureAmount: 40.5,
      salt: 0.0,
      saltAmount: 0.0,
      pH: 6.0,
      protein: 23.2,
      fat: 5.5,
      starch: 190.9,
    },
    colors: {
      primary: '#e8c794',
      light: '#d4944a',
      background: '#b46c1f',
      border: '#9a5a18',
    },
    shopifyVariantId: '45123755770012',
  },
  // {
  //   id: 'brown-rice-koji',
  //   name: '玄米麹',
  //   shortName: '玄米麹',
  //   category: 'koji',
  //   icon: '/img/brown-rice.png',
  //   thumbnail: '/materials/brown-rice-koji.jpg',
  //   description: '玄米を麹菌で発酵させた発酵触媒',
  //   parameters: {
  //     weight: 270,
  //     moisture: 15.00,
  //     moistureAmount: 40.5,
  //     salt: 0.00,
  //     saltAmount: 0.0,
  //     pH: 6.3,
  //     protein: 20.5,
  //     fat: 6.0,
  //     starch: 185.4,
  //   },
  //   colors: {
  //     primary: '#a0522d',
  //     light: '#cd853f',
  //     background: '#a0522d',
  //     border: '#8b4513',
  //   },
  //   shopifyVariantId: '45123756000004',
  // },
  // {
  //   id: 'wheat-koji',
  //   name: '小麦麹',
  //   shortName: '小麦麹',
  //   category: 'koji',
  //   icon: '/img/wheat-koji.png',
  //   thumbnail: '/materials/wheat-koji.jpg',
  //   description: '小麦を麹菌で発酵させた発酵触媒',
  //   parameters: {
  //     weight: 270,
  //     moisture: 15.00,
  //     moistureAmount: 40.5,
  //     salt: 0.00,
  //     saltAmount: 0.0,
  //     pH: 6.1,
  //     protein: 27.3,
  //     fat: 4.9,
  //     starch: 196.3,
  //   },
  //   colors: {
  //     primary: '#f4e4a6',
  //     light: '#f9f0c4',
  //     background: '#f4e4a6',
  //     border: '#e6d68a',
  //   },
  //   shopifyVariantId: '45123756000005',
  // },
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
