'use client';

import { useState } from 'react';
import { Material } from '@/types/material';
import { SOYBEAN, CHICKPEA, RICE_KOJI, BARLEY_KOJI, BROWN_RICE_KOJI, WHEAT_KOJI } from '@/constants/materials';
import CompoundDisplay from '@/components/CompoundDisplay';
import PurchaseButton from '@/components/PurchaseButton';
import Deliverables from '@/components/Deliverables';
import BrewingConditions from '@/components/BrewingConditions';

const INITIAL_MATERIALS: Material[] = [
  SOYBEAN,
  CHICKPEA,
  RICE_KOJI,
  BARLEY_KOJI,
  BROWN_RICE_KOJI,
  WHEAT_KOJI,
];

export default function MaterialLab() {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedRegion, setSelectedRegion] = useState<string>('関東');

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

  const handleReset = () => {
    setSelectedMaterials([]);
  };

  const handleReplaceMaterials = (materials: Material[]) => {
    setSelectedMaterials(materials);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="py-8 flex flex-col gap-y-8 md:gap-y-12 items-center">
        <header className="text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-ferment-primary">
            発酵シミュレーション
          </h1>
          <p className="text-lg text-ferment-secondary max-w-2xl mx-auto">
            目に見えない菌の営みである「発酵」の不思議な世界を体験し、
            あなただけの味噌材料キットを組み合わせてみましょう。
          </p>
        </header>

        <div className="max-w-3xl w-full mx-auto space-y-8">
          {/* 化合物表示エリア（横幅一杯） */}
          <CompoundDisplay
            selectedMaterials={selectedMaterials}
            onMaterialRemove={handleMaterialRemove}
            materials={INITIAL_MATERIALS}
            onMaterialAdd={handleMaterialAdd}
            onReset={handleReset}
            onReplaceMaterials={handleReplaceMaterials}
            selectedMonth={selectedMonth}
            selectedRegion={selectedRegion}
          />

          {/* 出来上がりシミュレーション */}
          <Deliverables
            selectedMaterials={selectedMaterials}
            selectedMonth={selectedMonth}
            selectedRegion={selectedRegion}
          />

          {/* 仕込み条件選択 */}
          <BrewingConditions
            selectedMonth={selectedMonth}
            selectedRegion={selectedRegion}
            onMonthChange={setSelectedMonth}
            onRegionChange={setSelectedRegion}
          />
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
