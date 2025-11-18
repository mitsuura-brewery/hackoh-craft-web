'use client';

import { Material } from '@/types/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface KojiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  kojiMaterials: Material[];
  selectedMaterials: Material[];
  onMaterialAdd: (material: Material) => void;
}

export default function KojiDialog({
  isOpen,
  onClose,
  kojiMaterials,
  selectedMaterials,
  onMaterialAdd,
}: KojiDialogProps) {
  const handleMaterialAdd = (material: Material) => {
    onMaterialAdd(material);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-ferment-primary">
            麹を選択
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <div className="grid grid-cols-2 gap-4">
            {kojiMaterials.map((material, index) => (
              <KojiGridItem
                key={material.id}
                material={material}
                count={selectedMaterials.filter((m) => m.id === material.id).length}
                onAdd={() => handleMaterialAdd(material)}
                selectedMaterials={selectedMaterials}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface KojiGridItemProps {
  material: Material;
  count: number;
  onAdd: () => void;
  selectedMaterials: Material[];
  delay: number;
}

function KojiGridItem({
  material,
  count,
  onAdd,
  selectedMaterials,
  delay,
}: KojiGridItemProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleIconClick = () => {
    // 15個の制限をチェック
    if (selectedMaterials.length >= 15) return;

    setIsPressed(true);
    onAdd();
    setTimeout(() => setIsPressed(false), 150);
  };

  const materialColor = {
    backgroundColor: `${material.colors.background}33`, // 20% opacity
    borderColor: material.colors.border,
    primaryColor: material.colors.primary,
  };

  const isDisabled = selectedMaterials.length >= 15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="relative"
    >
      <div className="relative">
        <motion.button
          whileTap={{ scale: isDisabled ? 1 : 0.9 }}
          onClick={handleIconClick}
          disabled={isDisabled}
          className={cn(
            'w-20 h-20 rounded-full border-2 shadow-lg flex flex-col items-center justify-center transition-all duration-200 backdrop-blur-sm',
            isPressed && 'opacity-80',
            isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer',
          )}
          style={
            {
              '--material-bg': materialColor.backgroundColor,
              '--material-border': materialColor.borderColor,
              backgroundColor: 'var(--material-bg)',
              borderColor: 'var(--material-border)',
            } as React.CSSProperties
          }
          title={isDisabled ? '材料の上限に達しました（15個まで）' : `${material.name}を追加`}
        >
          <Image
            src={material.icon}
            alt={material.shortName}
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-xs font-medium mt-1 text-center leading-tight">
            {material.shortName}
          </span>
        </motion.button>

        {/* 数量表示 */}
        <AnimatePresence>
          {count > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={
                {
                  '--material-primary': materialColor.borderColor,
                  backgroundColor: 'var(--material-primary)',
                } as React.CSSProperties
              }
            >
              {count}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}