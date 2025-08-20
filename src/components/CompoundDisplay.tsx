'use client';

import { Material, MaterialCategory } from '@/types/fermentation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, useTransition } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import IntegratedMaterialIcons from './IntegratedMaterialIcons';
import { Blend } from 'lucide-react';
import Image from 'next/image';

interface CompoundDisplayProps {
  selectedMaterials: Material[];
  onMaterialRemove?: (materialId: string) => void;
  materials: Material[];
  onMaterialAdd: (material: Material) => void;
}

export default function CompoundDisplay({
  selectedMaterials,
  onMaterialRemove,
  materials,
  onMaterialAdd,
}: CompoundDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 375, height: 300 });

  // 警告メッセージを判定する関数
  const getWarningMessage = (materials: Material[]): string | null => {
    if (materials.length === 0) return null;

    const materialCounts = materials.reduce((acc, material) => {
      acc[material.category] = (acc[material.category] || 0) + 1;
      return acc;
    }, {} as Record<MaterialCategory, number>);

    const proteinCount = materialCounts.protein || 0;
    const kojiCount = materialCounts.koji || 0;

    // 麹がない場合
    if (proteinCount > 0 && kojiCount === 0) {
      return '麹菌が必要です。発酵が進みません。';
    }

    // タンパク質がない場合
    if (kojiCount > 0 && proteinCount === 0) {
      return 'タンパク質材料が必要です。';
    }

    // 麹が多すぎる場合
    if (kojiCount > proteinCount * 2) {
      return '麹菌が多すぎます。苦味が強くなる可能性があります。';
    }

    // タンパク質が多すぎる場合
    if (proteinCount > kojiCount * 3) {
      return 'タンパク質が多すぎます。発酵が不十分になる可能性があります。';
    }

    return null;
  };

  const containerSpring = useSpring({
    opacity: 1,
    transform: 'scale(1)',
  });

  const transitions = useTransition(selectedMaterials, {
    from: { opacity: 0, scale: 0, rotate: 0 },
    enter: { opacity: 1, scale: 1, rotate: 360 },
    leave: { opacity: 0, scale: 0, rotate: -360 },
    config: { tension: 300, friction: 20 },
  });

  // オーガニック境界線の描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rc = rough.canvas(canvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (selectedMaterials.length > 0) {
        const time = Date.now() * 0.001;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;

        // 呼吸するようなオーガニック境界線
        const points: [number, number][] = [];
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          const wobble = Math.sin(time * 2 + angle * 3) * 10;
          const wobble2 = Math.cos(time * 1.5 + angle * 2) * 8;
          const r = radius + wobble + wobble2;

          points.push([centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r]);
        }

        // 閉じた形状にする
        points.push(points[0]);

        rc.polygon(points, {
          fill: 'rgba(139, 69, 19, 0.1)',
          stroke: 'rgba(139, 69, 19, 0.4)',
          strokeWidth: 2,
          roughness: 1.5,
          fillStyle: 'hachure',
          hachureAngle: time * 20,
          hachureGap: 8,
        });
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [selectedMaterials.length]);

  // キャンバスのリサイズ
  useEffect(() => {
    const updateDimensions = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const { width } = container.getBoundingClientRect();
        setDimensions({ width: Math.min(width, 400), height: 300 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <animated.div
      style={containerSpring}
      className="relative py-6 min-h-[400px] flex flex-col items-center justify-center w-full max-w-[480px] mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <Blend className="text-ferment-primary" size={24} />
        <h2 className="text-2xl font-bold text-ferment-primary">合わせる</h2>
      </div>

      <div className="relative flex-1 flex items-center justify-center w-full">
        {/* 選択中の材料一覧（キャンバス上端にabsolute配置） */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-center">
          <AnimatePresence>
            {selectedMaterials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-wrap justify-center gap-2 px-4 py-2"
              >
                {Object.entries(
                  selectedMaterials.reduce((acc, material) => {
                    acc[material.id] = acc[material.id] || { material, count: 0 };
                    acc[material.id].count++;
                    return acc;
                  }, {} as Record<string, { material: Material; count: number }>),
                ).map(([id, { material, count }]) => (
                  <motion.span
                    key={id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
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
                      <span className="text-xs font-bold text-ferment-dark">x{count}</span>
                    )}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 警告文エリア（キャンバス下端にabsolute配置） */}
        <div className="absolute bottom-0 left-0 mx-6 right-0 z-20 flex justify-center">
          <AnimatePresence>
            {getWarningMessage(selectedMaterials) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-4 py-2 bg-red-100/95 backdrop-blur-md border border-red-300 rounded-lg text-red-700 text-sm text-center shadow-lg"
              >
                ⚠️ {getWarningMessage(selectedMaterials)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* オーガニック境界線のキャンバス */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        />

        {/* 材料アイコンの配置 */}
        <div
          className="relative"
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        >
          <AnimatePresence>
            {transitions((style, material, _, index) => {
              if (!material || selectedMaterials.length === 0) return null;

              // 材料を電子殻のように配置（最初5個は内殻、次10個は外殻）
              let radius, angle;

              if (selectedMaterials.length === 1) {
                // 1つの場合は中心
                radius = 0;
                angle = 0;
              } else if (index < 5) {
                // 最初の5個：内殻（現在の計算方式）
                const materialsInInnerShell = Math.min(5, selectedMaterials.length);
                const baseRadius = Math.min(dimensions.width, dimensions.height) * 0.08;

                angle = (index / materialsInInnerShell) * Math.PI * 2;
                radius = baseRadius;
              } else {
                // 6個目以降：外殻（固定半径で10個まで）
                const positionInOuterShell = index - 5; // 0-9の位置
                const materialsInOuterShell = selectedMaterials.length - 5; // 外殻の材料数
                const outerRadius = Math.min(dimensions.width, dimensions.height) * 0.18; // 固定半径

                angle = (positionInOuterShell / materialsInOuterShell) * Math.PI * 2;
                radius = outerRadius;
              }
              const x = dimensions.width / 2 + Math.cos(angle) * radius;
              const y = dimensions.height / 2 + Math.sin(angle) * radius;

              return (
                <animated.div
                  key={material.id}
                  style={{
                    ...style,
                    position: 'absolute',
                    left: x - 25,
                    top: y - 25,
                    width: 50,
                    height: 50,
                  }}
                  className="flex items-center justify-center"
                >
                  <motion.button
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.5,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onMaterialRemove?.(material.id)}
                    className="text-3xl filter drop-shadow-lg cursor-pointer hover:brightness-110 transition-all duration-200 hover:bg-red-100/20 rounded-full p-1"
                    title={`${material.name}を削除`}
                  >
                    <Image
                      src={material.icon}
                      alt={material.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </motion.button>
                </animated.div>
              );
            })}
          </AnimatePresence>

          {/* 空の状態 */}
          {selectedMaterials.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-ferment-secondary/60"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🧪
              </motion.div>
              <p className="text-center">
                左右のアイコンで
                <br />
                材料を追加しよう
              </p>
            </motion.div>
          )}
        </div>

        {/* 統合された材料アイコン */}
        <IntegratedMaterialIcons
          materials={materials}
          selectedMaterials={selectedMaterials}
          onMaterialAdd={onMaterialAdd}
        />
      </div>
    </animated.div>
  );
}
