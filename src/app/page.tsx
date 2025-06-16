'use client';

import { useState } from 'react';
import { Material, INITIAL_MATERIALS } from '@/types/fermentation';
import { calculateFermentation } from '@/utils/fermentation';
import MaterialSelector from '@/components/MaterialSelector';
import CompoundDisplay from '@/components/CompoundDisplay';
import NutritionPanel from '@/components/NutritionPanel';
import PurchaseButton from '@/components/PurchaseButton';

export default function FermentationLab() {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  
  const calculation = calculateFermentation(selectedMaterials);
  
  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterials(prev => {
      const exists = prev.find(m => m.id === material.id);
      if (exists) {
        return prev.filter(m => m.id !== material.id);
      }
      return [...prev, material];
    });
  };
  
  const handleClearAll = () => {
    setSelectedMaterials([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-ferment-primary">
            発酵の実験室
          </h1>
          <p className="text-lg text-ferment-secondary max-w-2xl mx-auto">
            目に見えない菌の営みである「発酵」の不思議な世界を体験し、
            あなただけの味噌材料キットを組み合わせてみましょう。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 材料選択エリア */}
          <div className="lg:col-span-1">
            <MaterialSelector
              materials={INITIAL_MATERIALS}
              selectedMaterials={selectedMaterials}
              onMaterialSelect={handleMaterialSelect}
              onClearAll={handleClearAll}
            />
          </div>

          {/* 化合物表示エリア */}
          <div className="lg:col-span-1">
            <CompoundDisplay
              selectedMaterials={selectedMaterials}
              fermentationPeriod={calculation.fermentationPeriod}
            />
          </div>

          {/* 成分表・購入エリア */}
          <div className="lg:col-span-1 space-y-6">
            <NutritionPanel
              nutritionFacts={calculation.nutritionFacts}
              fermentationPeriod={calculation.fermentationPeriod}
              recommendation={calculation.recommendation}
            />
            
            <PurchaseButton
              selectedMaterials={selectedMaterials}
              disabled={selectedMaterials.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
