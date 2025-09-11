'use client';

import { Material } from '@/types/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface KojiGridProps {
  kojiMaterials: Material[];
  selectedMaterials: Material[];
  onMaterialAdd: (material: Material) => void;
  side: 'left' | 'right';
  displayMode: 'minimal' | 'medium' | 'full';
}

export default function KojiGrid({
  kojiMaterials,
  selectedMaterials,
  onMaterialAdd,
  side,
  displayMode,
}: KojiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {kojiMaterials.map((material, index) => (
        <MaterialIconButton
          key={material.id}
          material={material}
          count={selectedMaterials.filter((m) => m.id === material.id).length}
          onAdd={() => onMaterialAdd(material)}
          side={side}
          displayMode={displayMode}
          delay={index * 0.1}
          selectedMaterials={selectedMaterials}
        />
      ))}
    </div>
  );
}

interface MaterialIconButtonProps {
  material: Material;
  count: number;
  onAdd: () => void;
  side: 'left' | 'right';
  displayMode: 'minimal' | 'medium' | 'full';
  delay: number;
  selectedMaterials: Material[];
}

function MaterialIconButton({
  material,
  count,
  onAdd,
  side,
  displayMode,
  delay,
  selectedMaterials,
}: MaterialIconButtonProps) {
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

  // 画面幅に応じたサイズとレイアウト
  const getButtonConfig = () => {
    switch (displayMode) {
      case 'full':
        return {
          size: 'w-20 h-20',
          showInfo: true,
        };
      // case 'medium':
      default:
        return {
          size: 'w-18 h-18',
          showInfo: true,
        };
    }
  };

  const config = getButtonConfig();
  const isDisabled = selectedMaterials.length >= 15;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="relative group"
    >
      {/* メイン材料ボタン */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: isDisabled ? 1 : 0.9 }}
          onClick={handleIconClick}
          disabled={isDisabled}
          className={cn(
            config.size,
            'rounded-full border-2 shadow-lg flex flex-col items-center justify-center transition-all duration-200 backdrop-blur-sm',
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
              className={cn(
                'absolute top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold',
                side === 'left' ? 'right-0' : 'left-0',
              )}
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

      {/* 詳細情報パネル（medium以上で表示） */}
      {config.showInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 z-10 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-ferment-light/50 whitespace-nowrap pointer-events-none',
            side === 'left' ? 'left-full ml-4' : 'right-full mr-4',
            displayMode === 'full' ? 'min-w-[200px]' : 'min-w-[160px]',
          )}
        >
          <div className="text-sm">
            <p
              className="font-semibold mb-1"
              style={
                {
                  '--material-primary': materialColor.primaryColor,
                  color: 'var(--material-primary)',
                } as React.CSSProperties
              }
            >
              {material.name}
            </p>
            <p className="text-xs text-ferment-dark/70 mb-2">{material.description}</p>
            <p className="text-xs text-green-600 mb-1">クリックで追加</p>
            <div className="text-xs text-ferment-secondary/80">
              <div>でんぷん: {material.parameters.starch}g</div>
              {displayMode === 'full' && <div>水分: {material.parameters.moisture}%</div>}
            </div>
          </div>
        </motion.div>
      )}

      {/* スマホ用シンプルツールチップ */}
      {!config.showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none',
            side === 'left' ? 'left-full ml-2' : 'right-full mr-2',
          )}
        >
          {material.shortName}
        </motion.div>
      )}
    </motion.div>
  );
}