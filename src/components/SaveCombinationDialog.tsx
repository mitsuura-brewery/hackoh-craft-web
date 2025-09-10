'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Material } from '@/types/material';
import { saveCombination, generateCombinationLabel } from '@/utils/combination';
import { calculateMaterialSpecs } from '@/utils/material';
import AnimatedNumber from '@/components/AnimatedNumber';

interface SaveCombinationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  selectedMonth?: number;
  selectedRegion?: string;
  onSave?: () => void;
}

export default function SaveCombinationDialog({
  isOpen,
  onClose,
  materials,
  selectedMonth = new Date().getMonth() + 1,
  selectedRegion = '関東',
  onSave,
}: SaveCombinationDialogProps) {
  const [label, setLabel] = useState(() => generateCombinationLabel(materials));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 材料が変更されたときにラベルを更新
  useEffect(() => {
    if (isOpen) {
      setLabel(generateCombinationLabel(materials));
    }
  }, [materials, isOpen]);

  const handleSave = () => {
    if (!label.trim()) return;

    saveCombination(label.trim(), materials);
    onSave?.();
    onClose();
  };

  const handleClose = () => {
    setLabel(generateCombinationLabel(materials));
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const materialCounts = materials.reduce((acc, material) => {
    acc[material.id] = acc[material.id] || { material, count: 0 };
    acc[material.id].count++;
    return acc;
  }, {} as Record<string, { material: Material; count: number }>);

  const specs = calculateMaterialSpecs(materials, selectedMonth, selectedRegion);

  const renderSpec = (label: string, value: number, unit: string) => (
    <div className="text-center">
      <p className="text-sm text-ferment-secondary mb-1">{label}</p>
      <p className="text-lg font-bold text-ferment-dark">
        <AnimatedNumber value={value} />
        <span className="text-sm text-ferment-secondary">{unit}</span>
      </p>
    </div>
  );

  const dialogContent = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-ferment-dark mb-6">組み合わせ</h2>

        <div className="grid md:grid-cols-2 md:gap-6">
          {/* 左側：保存設定 */}
          <div>
            <div className="mb-6">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ferment-primary"
                placeholder="組み合わせの名前を入力"
              />
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {Object.entries(materialCounts).map(([id, { material, count }]) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border text-ferment-dark"
                    style={
                      {
                        '--material-bg': `${material.colors.primary}40`,
                        '--material-border': `${material.colors.primary}80`,
                        backgroundColor: 'var(--material-bg)',
                        borderColor: 'var(--material-border)',
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      src={material.icon}
                      alt={material.shortName}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span>{material.shortName}</span>
                    {count > 1 && (
                      <span className="text-xs font-bold text-ferment-dark">×{count}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：シミュレーション結果 */}
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                {renderSpec('麹歩合', specs.kojiRatio, '')}
                {renderSpec('加水量', specs.waterAmount, 'ml')}
                {renderSpec('塩分', specs.saltRatio, '%')}
                {renderSpec('重量', specs.totalWeight, 'g')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!label.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-ferment-primary rounded-md hover:bg-ferment-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
