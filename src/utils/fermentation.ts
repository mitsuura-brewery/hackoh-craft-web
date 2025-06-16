import { 
  Material, 
  Compound, 
  NutritionFacts, 
  FermentationCalculationResult,
  SEASONAL_TEMPERATURES,
  getCurrentSeason
} from '@/types/fermentation';

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
    return sum + (material.parameters.enzyme || 0) * 0.8;
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
    carbohydrate: materials.reduce((sum, m) => sum + (m.parameters.enzyme || 0) * 4, 0),
    fat: materials.reduce((sum, m) => sum + 0.8, 0), // 発酵により生成される脂質
    sodium: materials.reduce((sum, m) => sum + (m.parameters.salt || 0) * 400, 0), // mg単位
    fiber: materials.reduce((sum, m) => sum + 2.1, 0), // 材料由来の食物繊維
    calories: materials.reduce((sum, m) => 
      sum + (m.parameters.protein || 0) * 4 + (m.parameters.enzyme || 0) * 4 + 0.8 * 9, 0
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
  const materialIds = materials.map(m => m.id).join(',');
  const params = new URLSearchParams({
    materials: materialIds,
    utm_source: 'fermentation_lab',
    utm_medium: 'custom_blend'
  });
  
  return `${baseUrl}/cart/add?${params.toString()}`;
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