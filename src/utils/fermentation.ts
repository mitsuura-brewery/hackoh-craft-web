import { 
  Material, 
  Compound, 
  NutritionFacts, 
  FermentationCalculationResult,
  SEASONAL_TEMPERATURES,
  getCurrentSeason
} from '@/types/fermentation';

// 地域別・月別平均気温データ（概算値）
export const REGIONAL_TEMPERATURES: Record<string, Record<number, number>> = {
  北海道: {
    1: -5, 2: -3, 3: 2, 4: 9, 5: 15, 6: 19,
    7: 22, 8: 22, 9: 18, 10: 11, 11: 4, 12: -2
  },
  東北: {
    1: 2, 2: 3, 3: 6, 4: 12, 5: 17, 6: 21,
    7: 25, 8: 26, 9: 23, 10: 17, 11: 10, 12: 5
  },
  北関東: {
    1: 3, 2: 4, 3: 8, 4: 14, 5: 19, 6: 22,
    7: 26, 8: 27, 9: 24, 10: 18, 11: 12, 12: 6
  },
  関東: {
    1: 5, 2: 6, 3: 9, 4: 15, 5: 20, 6: 23,
    7: 27, 8: 28, 9: 25, 10: 19, 11: 14, 12: 8
  },
  北陸: {
    1: 3, 2: 4, 3: 7, 4: 13, 5: 18, 6: 22,
    7: 26, 8: 27, 9: 24, 10: 18, 11: 12, 12: 7
  },
  東海: {
    1: 4, 2: 5, 3: 9, 4: 15, 5: 19, 6: 23,
    7: 27, 8: 28, 9: 25, 10: 19, 11: 13, 12: 7
  },
  関西: {
    1: 5, 2: 6, 3: 9, 4: 15, 5: 20, 6: 24,
    7: 28, 8: 29, 9: 26, 10: 20, 11: 14, 12: 8
  },
  中国: {
    1: 4, 2: 5, 3: 8, 4: 14, 5: 19, 6: 23,
    7: 27, 8: 28, 9: 25, 10: 19, 11: 13, 12: 7
  },
  四国: {
    1: 5, 2: 6, 3: 10, 4: 16, 5: 21, 6: 25,
    7: 28, 8: 29, 9: 26, 10: 20, 11: 14, 12: 8
  },
  九州: {
    1: 7, 2: 8, 3: 12, 4: 17, 5: 22, 6: 26,
    7: 29, 8: 30, 9: 27, 10: 21, 11: 16, 12: 10
  },
  沖縄: {
    1: 17, 2: 18, 3: 20, 4: 23, 5: 26, 6: 28,
    7: 30, 8: 30, 9: 29, 10: 26, 11: 22, 12: 19
  }
};

export interface FermentationSpecs {
  kojiRatio: number;  // 麹歩合
  waterAmount: number; // 加水量(ml)
  saltRatio: number;  // 塩分(%)
  totalWeight: number; // 重量(g)
  fermentationPeriod: number; // 期間目安(日)
  moistureRatio: number; // 水分(%) - 内部計算用
}

export function calculateFermentationSpecs(
  selectedMaterials: Material[],
  month: number,
  region: string
): FermentationSpecs {
  if (selectedMaterials.length === 0) {
    return {
      kojiRatio: 0,
      waterAmount: 0,
      saltRatio: 0,
      totalWeight: 0,
      fermentationPeriod: 0,
      moistureRatio: 0
    };
  }

  // 材料を分類
  const proteinMaterials = selectedMaterials.filter(m => m.category === 'protein');
  const kojiMaterials = selectedMaterials.filter(m => m.category === 'koji');

  // タンパク質と麹の重量計算
  const totalProteinWeight = proteinMaterials.reduce((sum, m) => sum + m.parameters.weight, 0);
  const totalKojiWeight = kojiMaterials.reduce((sum, m) => sum + m.parameters.weight, 0);

  // 麹歩合：タンパク質と麹が1:1で10とする
  const kojiRatio = totalKojiWeight > 0 && totalProteinWeight > 0 
    ? Math.round((totalKojiWeight / totalProteinWeight) * 10) 
    : 0;

  // 総重量
  const totalWeight = selectedMaterials.reduce((sum, m) => sum + m.parameters.weight, 0);

  // 水分量計算
  const totalMoistureAmount = selectedMaterials.reduce((sum, m) => sum + m.parameters.moistureAmount, 0);
  const moistureRatio = totalWeight > 0 ? (totalMoistureAmount / totalWeight) * 100 : 0;

  // 加水量：麹歩合が10以下なら0、それ以外は水分が44%を超えるよう10ml単位で調整
  let waterAmount = 0;
  if (kojiRatio > 10) {
    const targetMoistureRatio = 44;
    if (moistureRatio < targetMoistureRatio) {
      const neededWater = (totalWeight * targetMoistureRatio / 100) - totalMoistureAmount;
      waterAmount = Math.ceil(neededWater / 10) * 10;
    }
  }

  // 塩分計算
  const totalSaltAmount = selectedMaterials.reduce((sum, m) => sum + m.parameters.saltAmount, 0);
  const saltRatio = totalWeight > 0 ? (totalSaltAmount / totalWeight) * 100 : 0;

  // 期間目安計算
  const averageTemperature = REGIONAL_TEMPERATURES[region]?.[month] || 20;
  let baseFermentationPeriod = 120; // ベース期間

  // 温度による調整：20度を基準に、暖かければ短く、寒ければ長く
  if (averageTemperature > 20) {
    const temperatureDifference = averageTemperature - 20;
    baseFermentationPeriod = Math.max(60, baseFermentationPeriod - (temperatureDifference * 3));
  } else if (averageTemperature < 20) {
    const temperatureDifference = 20 - averageTemperature;
    baseFermentationPeriod = Math.min(180, baseFermentationPeriod + (temperatureDifference * 2));
  }

  const fermentationPeriod = Math.round(baseFermentationPeriod);

  return {
    kojiRatio,
    waterAmount,
    saltRatio: Math.round(saltRatio * 10) / 10, // 小数点第1位まで
    totalWeight,
    fermentationPeriod,
    moistureRatio: Math.round(moistureRatio * 10) / 10 // 小数点第1位まで
  };
}

export const calculateFermentation = (materials: Material[]): FermentationCalculationResult => {
  if (materials.length === 0) {
    return {
      fermentationPeriod: 0,
      nutritionFacts: {
        protein: 0,
        carbohydrate: 0,
        fat: 0,
        sodium: 0,
        fiber: 0,
        calories: 0
      },
      recommendation: '材料を選択してください'
    };
  }

  const currentSeason = getCurrentSeason();
  const currentTemp = SEASONAL_TEMPERATURES[currentSeason];
  
  // 基本発酵期間の計算
  const baseFermentationDays = 30;
  const proteinMaterials = materials.filter(m => m.category === 'protein');
  const kojiMaterials = materials.filter(m => m.category === 'koji');
  
  // タンパク質材料の影響
  const proteinFactor = proteinMaterials.reduce((sum, material) => {
    return sum + (material.parameters.protein || 0) * 0.5;
  }, 0);
  
  // 麹材料の影響
  const enzymeFactor = kojiMaterials.reduce((sum, material) => {
    return sum + (material.parameters.starch || 0) * 0.01;
  }, 0);
  
  // 温度による影響（温度が高いほど発酵が早い）
  const tempFactor = currentTemp > 20 ? 0.8 : currentTemp < 15 ? 1.3 : 1.0;
  
  // 発酵期間の計算
  const fermentationPeriod = Math.round(
    (baseFermentationDays + proteinFactor - enzymeFactor) * tempFactor
  );
  
  // 栄養成分の計算
  const nutritionFacts: NutritionFacts = {
    protein: materials.reduce((sum, m) => sum + (m.parameters.protein || 0), 0),
    carbohydrate: materials.reduce((sum, m) => sum + (m.parameters.starch || 0), 0),
    fat: materials.reduce((sum, m) => sum + (m.parameters.fat || 0), 0),
    sodium: materials.reduce((sum, m) => sum + (m.parameters.saltAmount || 0), 0),
    fiber: materials.length * 2.1, // 材料由来の食物繊維
    calories: materials.reduce((sum, m) => 
      sum + (m.parameters.protein || 0) * 4 + (m.parameters.starch || 0) * 4 + (m.parameters.fat || 0) * 9, 0
    )
  };
  
  // 推奨メッセージの生成
  let recommendation = '';
  if (proteinMaterials.length === 0) {
    recommendation = 'タンパク質材料を追加してください';
  } else if (kojiMaterials.length === 0) {
    recommendation = '麹材料を追加してください';
  } else if (fermentationPeriod < 20) {
    recommendation = '短期間で発酵が完了します。風味が軽やかになります。';
  } else if (fermentationPeriod > 45) {
    recommendation = '長期発酵により、深いコクと旨味が生まれます。';
  } else {
    recommendation = 'バランスの良い発酵期間です。';
  }
  
  return {
    fermentationPeriod: Math.max(1, fermentationPeriod),
    nutritionFacts,
    recommendation
  };
};

export const generateShopifyUrl = (materials: Material[], baseUrl: string = 'https://your-shop.myshopify.com'): string => {
  // 材料ごとの数をカウント
  const materialCounts = materials.reduce((acc, material) => {
    acc[material.shopifyVariantId] = (acc[material.shopifyVariantId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // variantId:count の形式で組み立て
  const cartItems = Object.entries(materialCounts)
    .map(([variantId, count]) => `${variantId}:${count}`)
    .join(',');
  
  return `${baseUrl}/cart/${cartItems}?storefront=true`;
};

export const createCompound = (materials: Material[]): Compound => {
  const calculation = calculateFermentation(materials);
  
  return {
    id: `compound-${Date.now()}`,
    materials,
    fermentationPeriod: calculation.fermentationPeriod,
    nutritionFacts: calculation.nutritionFacts,
    createdAt: new Date()
  };
};