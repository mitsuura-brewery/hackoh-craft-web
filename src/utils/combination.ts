import { Material } from '@/types/material';
import { SavedCombination } from '@/types/combination';

const STORAGE_KEY = 'saved_combinations';

export const saveCombination = (label: string, materials: Material[]): void => {
  const combinations = getSavedCombinations();
  
  const materialCounts = materials.reduce((acc, material) => {
    acc[material.id] = (acc[material.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const newCombination: SavedCombination = {
    id: Date.now().toString(),
    label,
    materials: Object.entries(materialCounts).map(([materialId, count]) => ({
      materialId,
      count,
    })),
    createdAt: new Date().toISOString(),
  };

  combinations.push(newCombination);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(combinations));
};

export const getSavedCombinations = (): SavedCombination[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const deleteCombination = (id: string): void => {
  const combinations = getSavedCombinations();
  const filtered = combinations.filter(combo => combo.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const expandCombination = (
  combination: SavedCombination,
  allMaterials: Material[]
): Material[] => {
  const result: Material[] = [];
  
  combination.materials.forEach(({ materialId, count }) => {
    const material = allMaterials.find(m => m.id === materialId);
    if (material) {
      for (let i = 0; i < count; i++) {
        result.push(material);
      }
    }
  });
  
  return result;
};

export const generateCombinationLabel = (materials: Material[]): string => {
  const materialCounts = materials.reduce((acc, material) => {
    const key = material.shortName;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(materialCounts)
    .map(([name, count]) => count > 1 ? `${name}${count}` : name)
    .join('+');
};

export const findMatchingCombination = (
  materials: Material[],
  savedCombinations: SavedCombination[]
): SavedCombination | null => {
  const currentMaterialCounts = materials.reduce((acc, material) => {
    acc[material.id] = (acc[material.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return savedCombinations.find(combination => {
    // 組み合わせの材料数が同じかチェック
    if (combination.materials.length !== Object.keys(currentMaterialCounts).length) {
      return false;
    }

    // 各材料とその個数が一致するかチェック
    return combination.materials.every(({ materialId, count }) => {
      return currentMaterialCounts[materialId] === count;
    });
  }) || null;
};