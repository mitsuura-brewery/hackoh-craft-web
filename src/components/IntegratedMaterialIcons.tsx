'use client';

import { Material } from '@/types/fermentation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IntegratedMaterialIconsProps {
  materials: Material[];
  selectedMaterials: Material[];
  onMaterialAdd: (material: Material) => void;
}

export default function IntegratedMaterialIcons({
  materials,
  selectedMaterials,
  onMaterialAdd,
}: IntegratedMaterialIconsProps) {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const proteinMaterials = materials.filter((m) => m.category === 'protein');
  const kojiMaterials = materials.filter((m) => m.category === 'koji');

  // 画面幅に応じて情報量を決定
  const getDisplayMode = () => {
    if (screenWidth >= 1024) return 'full'; // デスクトップ - フル情報
    if (screenWidth >= 768) return 'medium'; // タブレット - 中程度情報
    return 'minimal'; // スマホ - 最小情報
  };

  const displayMode = getDisplayMode();

  return (
    <>
      {/* タンパク質ペーストアイコン群 - 左側 */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 pointer-events-auto z-10">
        <div className="flex flex-col gap-3">
          {proteinMaterials.map((material, index) => (
            <MaterialIconButton
              key={material.id}
              material={material}
              count={selectedMaterials.filter((m) => m.id === material.id).length}
              onAdd={() => onMaterialAdd(material)}
              side="left"
              displayMode={displayMode}
              delay={index * 0.1}
              selectedMaterials={selectedMaterials}
            />
          ))}
        </div>
      </div>

      {/* 麹菌アイコン群 - 右側 */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-auto z-10">
        <div className="flex flex-col gap-3">
          {kojiMaterials.map((material, index) => (
            <MaterialIconButton
              key={material.id}
              material={material}
              count={selectedMaterials.filter((m) => m.id === material.id).length}
              onAdd={() => onMaterialAdd(material)}
              side="right"
              displayMode={displayMode}
              delay={index * 0.1}
              selectedMaterials={selectedMaterials}
            />
          ))}
        </div>
      </div>
    </>
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
          iconSize: 'text-3xl',
          showInfo: true,
          showName: true,
        };
      case 'medium':
        return {
          size: 'w-16 h-16',
          iconSize: 'text-2xl',
          showInfo: true,
          showName: false,
        };
      default:
        return {
          size: 'w-14 h-14',
          iconSize: 'text-xl',
          showInfo: false,
          showName: false,
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
            config.iconSize,
            isPressed && 'opacity-80',
            isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
          )}
          style={{
            '--material-bg': materialColor.backgroundColor,
            '--material-border': materialColor.borderColor,
            backgroundColor: 'var(--material-bg)',
            borderColor: 'var(--material-border)',
          } as React.CSSProperties}
          title={isDisabled ? '材料の上限に達しました（15個まで）' : `${material.name}を追加`}
        >
          <Image
            src={material.icon}
            alt={material.shortName}
            width={24}
            height={24}
            className="object-contain"
          />
          {config.showName && (
            <span className="text-xs font-medium mt-1 text-center leading-tight">
              {material.shortName}
            </span>
          )}
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
                side === 'left' ? 'right-0' : 'left-0'
              )}
              style={{
                '--material-primary': materialColor.primaryColor,
                backgroundColor: 'var(--material-primary)',
              } as React.CSSProperties}
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
            displayMode === 'full' ? 'min-w-[200px]' : 'min-w-[160px]'
          )}
        >
          <div className="text-sm">
            <p 
              className="font-semibold mb-1"
              style={{
                '--material-primary': materialColor.primaryColor,
                color: 'var(--material-primary)',
              } as React.CSSProperties}
            >
              {material.name}
            </p>
            <p className="text-xs text-ferment-dark/70 mb-2">{material.description}</p>
            <p className="text-xs text-green-600 mb-1">クリックで追加</p>
            <div className="text-xs text-ferment-secondary/80">
              {material.category === 'protein' && (
                <>
                  <div>タンパク質: {material.parameters.protein}%</div>
                  {displayMode === 'full' && (
                    <>
                      <div>塩分: {material.parameters.salt}%</div>
                      <div>水分: {material.parameters.moisture}%</div>
                    </>
                  )}
                </>
              )}
              {material.category === 'koji' && (
                <>
                  <div>でんぷん: {material.parameters.starch}g</div>
                  {displayMode === 'full' && <div>水分: {material.parameters.moisture}%</div>}
                </>
              )}
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
            side === 'left' ? 'left-full ml-2' : 'right-full mr-2'
          )}
        >
          {material.shortName}
        </motion.div>
      )}
    </motion.div>
  );
}
