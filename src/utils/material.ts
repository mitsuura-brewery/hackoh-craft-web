import {
  Material,
  Compound,
  NutritionFacts,
  MaterialCalculationResult,
  SEASONAL_TEMPERATURES,
  getCurrentSeason,
  KOJI_ENZYME_DATA,
  calculateProteaseActivity,
} from '@/types/material';

// 地域別・月別平均気温データ（概算値）
export const REGIONAL_TEMPERATURES: Record<string, Record<number, number>> = {
  北海道: {
    1: -5,
    2: -3,
    3: 2,
    4: 9,
    5: 15,
    6: 19,
    7: 22,
    8: 22,
    9: 18,
    10: 11,
    11: 4,
    12: -2,
  },
  東北: {
    1: 2,
    2: 3,
    3: 6,
    4: 12,
    5: 17,
    6: 21,
    7: 25,
    8: 26,
    9: 23,
    10: 17,
    11: 10,
    12: 5,
  },
  北関東: {
    1: 3,
    2: 4,
    3: 8,
    4: 14,
    5: 19,
    6: 22,
    7: 26,
    8: 27,
    9: 24,
    10: 18,
    11: 12,
    12: 6,
  },
  関東: {
    1: 5,
    2: 6,
    3: 9,
    4: 15,
    5: 20,
    6: 23,
    7: 27,
    8: 28,
    9: 25,
    10: 19,
    11: 14,
    12: 8,
  },
  北陸: {
    1: 3,
    2: 4,
    3: 7,
    4: 13,
    5: 18,
    6: 22,
    7: 26,
    8: 27,
    9: 24,
    10: 18,
    11: 12,
    12: 7,
  },
  東海: {
    1: 4,
    2: 5,
    3: 9,
    4: 15,
    5: 19,
    6: 23,
    7: 27,
    8: 28,
    9: 25,
    10: 19,
    11: 13,
    12: 7,
  },
  関西: {
    1: 5,
    2: 6,
    3: 9,
    4: 15,
    5: 20,
    6: 24,
    7: 28,
    8: 29,
    9: 26,
    10: 20,
    11: 14,
    12: 8,
  },
  中国: {
    1: 4,
    2: 5,
    3: 8,
    4: 14,
    5: 19,
    6: 23,
    7: 27,
    8: 28,
    9: 25,
    10: 19,
    11: 13,
    12: 7,
  },
  四国: {
    1: 5,
    2: 6,
    3: 10,
    4: 16,
    5: 21,
    6: 25,
    7: 28,
    8: 29,
    9: 26,
    10: 20,
    11: 14,
    12: 8,
  },
  九州: {
    1: 7,
    2: 8,
    3: 12,
    4: 17,
    5: 22,
    6: 26,
    7: 29,
    8: 30,
    9: 27,
    10: 21,
    11: 16,
    12: 10,
  },
  沖縄: {
    1: 17,
    2: 18,
    3: 20,
    4: 23,
    5: 26,
    6: 28,
    7: 30,
    8: 30,
    9: 29,
    10: 26,
    11: 22,
    12: 19,
  },
};

export interface MaterialSpecs {
  kojiRatio: number; // 麹歩合
  waterAmount: number; // 加水量(ml)
  saltRatio: number; // 塩分(%)
  totalWeight: number; // 重量(g)
  materialPeriod: number; // 期間目安(日)
  moistureRatio: number; // 水分(%) - 内部計算用
  // 新しい計算項目
  totalProtein: number; // たんぱく質(g)
  totalFat: number; // 脂質(g)
  totalStarch: number; // でんぷん(g)
  saltConcentration: number; // 対水食塩濃度(%)
  initialPH: number; // 初期pH
  averageAlphaAmylase: number; // 素材の混合比率で計算されたαアミラーゼ
  averageGlucoAmylase: number; // 素材の混合比率で計算されたグルコアミラーゼ
  averageProtease: number; // プロテアーゼ活性値
}

export function calculateMaterialSpecs(
  selectedMaterials: Material[],
  month: number,
  region: string,
): MaterialSpecs {
  if (month === 0 || region === '') {
    return {
      kojiRatio: 0,
      waterAmount: 0,
      saltRatio: 0,
      totalWeight: 0,
      materialPeriod: 0,
      moistureRatio: 0,
      totalProtein: 0,
      totalFat: 0,
      totalStarch: 0,
      saltConcentration: 0,
      initialPH: 0,
      averageAlphaAmylase: 0,
      averageGlucoAmylase: 0,
      averageProtease: 0,
    };
  }
  if (selectedMaterials.length === 0) {
    return {
      kojiRatio: 0,
      waterAmount: 0,
      saltRatio: 0,
      totalWeight: 0,
      materialPeriod: 0,
      moistureRatio: 0,
      totalProtein: 0,
      totalFat: 0,
      totalStarch: 0,
      saltConcentration: 0,
      initialPH: 0,
      averageAlphaAmylase: 0,
      averageGlucoAmylase: 0,
      averageProtease: 0,
    };
  }

  // 材料を分類
  const proteinMaterials = selectedMaterials.filter((m) => m.category === 'protein');
  const kojiMaterials = selectedMaterials.filter((m) => m.category === 'koji');

  // タンパク質と麹の個数計算
  const proteinCount = proteinMaterials.length;
  const kojiCount = kojiMaterials.length;

  // 麹歩合：タンパク質と麹が1:1で10とする（個数比ベース）
  const kojiRatio =
    kojiCount > 0 && proteinCount > 0 ? Math.round((kojiCount / proteinCount) * 10) : 0;

  // 総重量
  const totalWeight = selectedMaterials.reduce((sum, m) => sum + m.parameters.weight, 0);

  // 水分量計算
  const totalMoistureAmount = selectedMaterials.reduce(
    (sum, m) => sum + m.parameters.moistureAmount,
    0,
  );
  const moistureRatio = totalWeight > 0 ? (totalMoistureAmount / totalWeight) * 100 : 0;

  // 加水量：麹歩合が10以下なら0、それ以外は水分が44%を超えるよう10ml単位で調整
  let waterAmount = 0;
  if (kojiRatio > 10) {
    const targetMoistureRatio = 44;
    if (moistureRatio < targetMoistureRatio) {
      // 正しい計算式：(目標水分率 × 元重量 - 元水分量) / (1 - 目標水分率)
      const neededWater =
        ((targetMoistureRatio / 100) * totalWeight - totalMoistureAmount) /
        (1 - targetMoistureRatio / 100);
      waterAmount = Math.ceil(neededWater / 10) * 10;
    }
  }

  // 加水量を考慮した総重量と水分量の再計算
  const finalTotalWeight = totalWeight + waterAmount;
  const finalTotalMoistureAmount = totalMoistureAmount + waterAmount; // 水は100%水分
  const finalMoistureRatio =
    finalTotalWeight > 0 ? (finalTotalMoistureAmount / finalTotalWeight) * 100 : 0;

  // 塩分計算（加水量を考慮した総重量で計算）
  const totalSaltAmount = selectedMaterials.reduce((sum, m) => sum + m.parameters.saltAmount, 0);
  const saltRatio = finalTotalWeight > 0 ? (totalSaltAmount / finalTotalWeight) * 100 : 0;

  // 期間目安計算：900日を麹歩合で割った日数
  const materialPeriod = kojiRatio > 0 ? Math.round(900 / kojiRatio) : 0;

  // TODO: 地域と月による温度調整を追加予定
  // const averageTemperature = REGIONAL_TEMPERATURES[region]?.[month] || 20;
  // let baseMaterialPeriod = 120; // ベース期間
  //
  // // 温度による調整：20度を基準に、暖かければ短く、寒ければ長く
  // if (averageTemperature > 20) {
  //   const temperatureDifference = averageTemperature - 20;
  //   baseMaterialPeriod = Math.max(60, baseMaterialPeriod - (temperatureDifference * 3));
  // } else if (averageTemperature < 20) {
  //   const temperatureDifference = 20 - averageTemperature;
  //   baseMaterialPeriod = Math.min(180, baseMaterialPeriod + (temperatureDifference * 2));
  // }
  // const materialPeriod = Math.round(baseMaterialPeriod);

  // 新しい計算項目の追加

  // 1. たんぱく質、脂質、でんぷんを個別に計算
  const totalProtein = selectedMaterials.reduce((sum, m) => sum + m.parameters.protein, 0);
  const totalFat = selectedMaterials.reduce((sum, m) => sum + m.parameters.fat, 0);
  const totalStarch = selectedMaterials.reduce((sum, m) => sum + m.parameters.starch, 0);

  // 2. 対水食塩濃度（塩分量 / 水分量 * 100）
  const saltConcentration = finalTotalMoistureAmount > 0 
    ? (totalSaltAmount / finalTotalMoistureAmount) * 100 
    : 0;

  // 3. 初期pH（素材の混合比率で計算、重量比）
  const initialPH = finalTotalWeight > 0 
    ? selectedMaterials.reduce((sum, m) => sum + m.parameters.pH * m.parameters.weight, 0) / totalWeight
    : 0;

  // 4. αアミラーゼとグルコアミラーゼの平均値（麹材料のみ、重量比）
  const kojiTotalWeight = kojiMaterials.reduce((sum, m) => sum + m.parameters.weight, 0);
  let averageAlphaAmylase = 0;
  let averageGlucoAmylase = 0;

  if (kojiTotalWeight > 0) {
    averageAlphaAmylase = kojiMaterials.reduce((sum, m) => {
      const enzymeData = m.name.includes('米麹') ? KOJI_ENZYME_DATA.rice :
                        m.name.includes('麦麹') ? KOJI_ENZYME_DATA.barley :
                        { alphaAmylase: 0, glucoAmylase: 0 };
      return sum + enzymeData.alphaAmylase * m.parameters.weight;
    }, 0) / kojiTotalWeight;

    averageGlucoAmylase = kojiMaterials.reduce((sum, m) => {
      const enzymeData = m.name.includes('米麹') ? KOJI_ENZYME_DATA.rice :
                        m.name.includes('麦麹') ? KOJI_ENZYME_DATA.barley :
                        { alphaAmylase: 0, glucoAmylase: 0 };
      return sum + enzymeData.glucoAmylase * m.parameters.weight;
    }, 0) / kojiTotalWeight;
  }

  // 5. プロテアーゼ活性値（重量比平均）
  let averageProtease = 0;
  if (kojiTotalWeight > 0) {
    averageProtease = kojiMaterials.reduce((sum, m) => {
      const kojiType = m.name.includes('米麹') ? 'rice' :
                      m.name.includes('麦麹') ? 'barley' : 'rice';
      const proteaseValue = calculateProteaseActivity(kojiType, initialPH);
      return sum + proteaseValue * m.parameters.weight;
    }, 0) / kojiTotalWeight;
  }

  return {
    kojiRatio,
    waterAmount,
    saltRatio: Math.round(saltRatio * 10) / 10, // 小数点第1位まで
    totalWeight: finalTotalWeight, // 加水量を含む総重量
    materialPeriod,
    moistureRatio: Math.round(finalMoistureRatio * 10) / 10, // 加水量を含む水分率
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    totalStarch: Math.round(totalStarch * 10) / 10,
    saltConcentration: Math.round(saltConcentration * 10) / 10,
    initialPH: Math.round(initialPH * 100) / 100,
    averageAlphaAmylase: Math.round(averageAlphaAmylase * 10) / 10,
    averageGlucoAmylase: Math.round(averageGlucoAmylase * 10) / 10,
    averageProtease: Math.round(averageProtease * 10) / 10,
  };
}

export const calculateMaterial = (materials: Material[]): MaterialCalculationResult => {
  if (materials.length === 0) {
    return {
      materialPeriod: 0,
      nutritionFacts: {
        protein: 0,
        carbohydrate: 0,
        fat: 0,
        sodium: 0,
        fiber: 0,
        calories: 0,
      },
      recommendation: '材料を選択してください',
    };
  }

  const currentSeason = getCurrentSeason();
  const currentTemp = SEASONAL_TEMPERATURES[currentSeason];

  // 基本発酵期間の計算
  const baseMaterialDays = 30;
  const proteinMaterials = materials.filter((m) => m.category === 'protein');
  const kojiMaterials = materials.filter((m) => m.category === 'koji');

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
  const materialPeriod = Math.round((baseMaterialDays + proteinFactor - enzymeFactor) * tempFactor);

  // 栄養成分の計算
  const nutritionFacts: NutritionFacts = {
    protein: materials.reduce((sum, m) => sum + (m.parameters.protein || 0), 0),
    carbohydrate: materials.reduce((sum, m) => sum + (m.parameters.starch || 0), 0),
    fat: materials.reduce((sum, m) => sum + (m.parameters.fat || 0), 0),
    sodium: materials.reduce((sum, m) => sum + (m.parameters.saltAmount || 0), 0),
    fiber: materials.length * 2.1, // 材料由来の食物繊維
    calories: materials.reduce(
      (sum, m) =>
        sum +
        (m.parameters.protein || 0) * 4 +
        (m.parameters.starch || 0) * 4 +
        (m.parameters.fat || 0) * 9,
      0,
    ),
  };

  // 推奨メッセージの生成
  let recommendation = '';
  if (proteinMaterials.length === 0) {
    recommendation = 'タンパク質材料を追加してください';
  } else if (kojiMaterials.length === 0) {
    recommendation = '麹材料を追加してください';
  } else if (materialPeriod < 20) {
    recommendation = '短期間で発酵が完了します。風味が軽やかになります。';
  } else if (materialPeriod > 45) {
    recommendation = '長期発酵により、深いコクと旨味が生まれます。';
  } else {
    recommendation = 'バランスの良い発酵期間です。';
  }

  return {
    materialPeriod: Math.max(1, materialPeriod),
    nutritionFacts,
    recommendation,
  };
};

export const generateShopifyUrl = (
  materials: Material[],
  baseUrl: string = 'https://your-shop.myshopify.com',
  combiNumber: string = '',
): string => {
  // 材料ごとの数をカウント
  const materialCounts = materials.reduce((acc, material) => {
    acc[material.shopifyVariantId] = (acc[material.shopifyVariantId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // variantId:count の形式で組み立て
  const cartItems = Object.entries(materialCounts)
    .map(([variantId, count]) => `${variantId}:${count}`)
    .join(',');

  // 基本URL
  let url = `${baseUrl}/cart/${cartItems}?storefront=true`;

  // 組み合わせ番号がある場合はクエリパラメータに追加
  if (combiNumber) {
    const noteParam = encodeURIComponent(`組み合わせ番号: ${combiNumber}`);
    const combiParam = encodeURIComponent(combiNumber);
    url += `&note=${noteParam}&attributes[combi-number]=${combiParam}`;
  }

  return url;
};

export const createCompound = (materials: Material[]): Compound => {
  const calculation = calculateMaterial(materials);

  return {
    id: `compound-${Date.now()}`,
    materials,
    materialPeriod: calculation.materialPeriod,
    nutritionFacts: calculation.nutritionFacts,
    createdAt: new Date(),
  };
};
