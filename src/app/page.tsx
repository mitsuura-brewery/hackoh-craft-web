'use client';

import { useState } from 'react';
import { Material, INITIAL_MATERIALS } from '@/types/fermentation';
import { calculateFermentation } from '@/utils/fermentation';
import CompoundDisplay from '@/components/CompoundDisplay';
import NutritionPanel from '@/components/NutritionPanel';
import PurchaseButton from '@/components/PurchaseButton';

export default function FermentationLab() {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  const calculation = calculateFermentation(selectedMaterials);

  const handleMaterialAdd = (material: Material) => {
    setSelectedMaterials((prev) => [...prev, material]);
  };

  const handleMaterialRemove = (materialId: string) => {
    setSelectedMaterials((prev) => {
      const index = prev.findIndex((m) => m.id === materialId);
      if (index >= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="py-8 flex flex-col gap-y-8 md:gap-y-12 items-center">
        <header className="text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-ferment-primary">発酵の実験室</h1>
          <p className="text-lg text-ferment-secondary max-w-2xl mx-auto">
            目に見えない菌の営みである「発酵」の不思議な世界を体験し、
            あなただけの味噌材料キットを組み合わせてみましょう。
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-16 max-w-5xl mx-auto">
          {/* 化合物表示エリア（横幅一杯） */}
          <div className="w-full">
            <CompoundDisplay
              selectedMaterials={selectedMaterials}
              onMaterialRemove={handleMaterialRemove}
              materials={INITIAL_MATERIALS}
              onMaterialAdd={handleMaterialAdd}
            />
          </div>

          {/* 成分表エリア */}
          <div className="w-full">
            <NutritionPanel
              nutritionFacts={calculation.nutritionFacts}
              fermentationPeriod={calculation.fermentationPeriod}
              recommendation={calculation.recommendation}
            />
          </div>
        </div>

        {/* 購入エリア */}
        <div className="space-y-6">
          <PurchaseButton
            selectedMaterials={selectedMaterials}
            disabled={selectedMaterials.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
