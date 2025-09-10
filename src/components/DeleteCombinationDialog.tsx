'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Material } from '@/types/material';
import { SavedCombination } from '@/types/combination';
import { deleteCombination } from '@/utils/combination';

interface DeleteCombinationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  combination: SavedCombination | null;
  materials: Material[];
  onDelete?: () => void;
}

export default function DeleteCombinationDialog({
  isOpen,
  onClose,
  combination,
  materials,
  onDelete,
}: DeleteCombinationDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleDelete = () => {
    if (!combination) return;
    
    deleteCombination(combination.id);
    onDelete?.();
    onClose();
  };

  if (!isOpen || !combination || !mounted) return null;

  const materialCounts = combination.materials.reduce((acc, { materialId, count }) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      acc[materialId] = { material, count };
    }
    return acc;
  }, {} as Record<string, { material: Material; count: number }>);

  const dialogContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-ferment-dark mb-4">組み合わせを削除</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            以下の組み合わせを削除しますか？
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-ferment-dark mb-2">{combination.label}</h3>
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

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}