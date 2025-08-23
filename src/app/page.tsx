'use client';

import { useState } from 'react';
import { Material, INITIAL_MATERIALS } from '@/types/fermentation';
import CompoundDisplay from '@/components/CompoundDisplay';
import PurchaseButton from '@/components/PurchaseButton';
import Deliverables from '@/components/Deliverables';

export default function FermentationLab() {
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
          />

          {/* 出来上がりシミュレーション */}
          <Deliverables
            selectedMaterials={selectedMaterials}
            selectedMonth={selectedMonth}
            selectedRegion={selectedRegion}
          />

          {/* 仕込み条件選択 */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-ferment-dark">お住まいの地域</label>
                <select
                  className="px-4 py-2 border border-ferment-secondary/30 rounded-lg bg-white text-ferment-dark focus:outline-none focus:ring-2 focus:ring-ferment-primary/50 focus:border-ferment-primary"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="北海道">北海道</option>
                  <option value="東北">東北</option>
                  <option value="北関東">北関東</option>
                  <option value="関東">関東</option>
                  <option value="北陸">北陸</option>
                  <option value="東海">東海</option>
                  <option value="関西">関西</option>
                  <option value="中国">中国</option>
                  <option value="四国">四国</option>
                  <option value="九州">九州</option>
                  <option value="沖縄">沖縄</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-ferment-dark">仕込む月</label>
                <select
                  className="px-4 py-2 border border-ferment-secondary/30 rounded-lg bg-white text-ferment-dark focus:outline-none focus:ring-2 focus:ring-ferment-primary/50 focus:border-ferment-primary"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  <option value={1}>1月</option>
                  <option value={2}>2月</option>
                  <option value={3}>3月</option>
                  <option value={4}>4月</option>
                  <option value={5}>5月</option>
                  <option value={6}>6月</option>
                  <option value={7}>7月</option>
                  <option value={8}>8月</option>
                  <option value={9}>9月</option>
                  <option value={10}>10月</option>
                  <option value={11}>11月</option>
                  <option value={12}>12月</option>
                </select>
              </div>
            </div>
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
