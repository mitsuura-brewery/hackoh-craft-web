'use client';

import { Material } from '@/types/material';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import { useSpring, animated, useTransition } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import IntegratedMaterialIcons from './IntegratedMaterialIcons';
import SavedCombinationSelect from './SavedCombinationSelect';
import SaveCombinationDialog from './SaveCombinationDialog';
import DeleteCombinationDialog from './DeleteCombinationDialog';
import Image from 'next/image';
import { SOYBEAN, RICE_KOJI } from '@/constants/materials';
import { SavedCombination } from '@/types/combination';
import { getSavedCombinations, findMatchingCombination } from '@/utils/combination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CompoundDisplayProps {
  selectedMaterials: Material[];
  onMaterialRemove?: (materialId: string) => void;
  materials: Material[];
  onMaterialAdd: (material: Material) => void;
  onReset?: () => void;
  onReplaceMaterials?: (materials: Material[]) => void;
  selectedMonth?: number;
  selectedRegion?: string;
}

export default function CompoundDisplay({
  selectedMaterials,
  onMaterialRemove,
  materials,
  onMaterialAdd,
  onReset,
  onReplaceMaterials,
  selectedMonth = new Date().getMonth() + 1,
  selectedRegion = '関東',
}: CompoundDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 375, height: 300 });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [matchingCombination, setMatchingCombination] = useState<SavedCombination | null>(null);
  const [isKagaMisoSelected, setIsKagaMisoSelected] = useState(false);

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

  // 保存済み組み合わせのチェック
  useEffect(() => {
    const combinations = getSavedCombinations();

    if (selectedMaterials.length > 0) {
      const matching = findMatchingCombination(selectedMaterials, combinations);
      setMatchingCombination(matching);
    } else {
      setMatchingCombination(null);
    }
  }, [selectedMaterials, refreshTrigger]);

  // 加賀味噌の組み合わせをチェック
  useEffect(() => {
    const kagaMaterials = [SOYBEAN, RICE_KOJI];
    const isKagaMatch =
      selectedMaterials.length === kagaMaterials.length &&
      kagaMaterials.every((material) =>
        selectedMaterials.some((selected) => selected.id === material.id),
      );
    setIsKagaMisoSelected(isKagaMatch);
  }, [selectedMaterials]);

  return (
    <animated.div
      style={containerSpring}
      className="relative min-h-[360px] sm:min-h-[400px] flex flex-col items-center justify-center w-[95%] sm:w-4/5 mx-auto"
    >
      <div className="relative flex-1 flex items-center justify-center w-full">
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
                const baseRadius = Math.min(dimensions.width, dimensions.height) * 0.1;

                angle = (index / materialsInInnerShell) * Math.PI * 2;
                radius = baseRadius;
              } else {
                // 6個目以降：外殻（固定半径で10個まで）
                const positionInOuterShell = index - 5; // 0-9の位置
                const materialsInOuterShell = selectedMaterials.length - 5; // 外殻の材料数
                const outerRadius = Math.min(dimensions.width, dimensions.height) * 0.22; // 固定半径

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
              <p className="text-center">
                左右のアイコンで
                <br />
                材料を追加
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

      {/* ご当地味噌テンプレートと保存した組み合わせ */}
      {onReplaceMaterials && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-0 left-1/2 -translate-x-1/2"
        >
          <div className="flex gap-4 items-center">
            <Select
              value={isKagaMisoSelected ? 'kaga' : ''}
              onValueChange={(value) => {
                if (value === 'kaga') {
                  onReplaceMaterials([SOYBEAN, RICE_KOJI]);
                }
              }}
            >
              <SelectTrigger
                className={`w-[140px] h-8 text-xs bg-white ${
                  isKagaMisoSelected ? 'text-red-600' : ''
                }`}
              >
                <SelectValue placeholder="ご当地味噌" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kaga">加賀味噌</SelectItem>
              </SelectContent>
            </Select>

            <SavedCombinationSelect
              allMaterials={materials}
              selectedMaterials={selectedMaterials}
              onSelect={onReplaceMaterials}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </motion.div>
      )}

      {/* 組み合わせ番号 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute bottom-[40px] left-1/2 -translate-x-1/2"
      >
        <div className="text-sm text-ferment-secondary">
          組み合わせ番号: <span className="font-semibold text-ferment-primary">123-456</span>
        </div>
      </motion.div>

      {/* 保存・削除・リセットボタン */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
      >
        <div className="flex gap-2">
          {matchingCombination ? (
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="outline"
              size="sm"
              className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 bg-white"
              disabled={selectedMaterials.length === 0}
            >
              削除する
            </Button>
          ) : (
            <Button
              onClick={() => setIsSaveDialogOpen(true)}
              variant="outline"
              size="sm"
              className={`h-8 text-xs ${
                selectedMaterials.length > 0
                  ? 'bg-white hover:bg-gray-50'
                  : 'bg-background border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedMaterials.length === 0}
            >
              保存する
            </Button>
          )}
          {onReset && (
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className={`h-8 text-xs ${
                selectedMaterials.length > 0
                  ? 'bg-white hover:bg-gray-50'
                  : 'bg-background border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedMaterials.length === 0}
            >
              リセット
            </Button>
          )}
        </div>
      </motion.div>

      {/* 保存ダイアログ */}
      <SaveCombinationDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        materials={selectedMaterials}
        selectedMonth={selectedMonth}
        selectedRegion={selectedRegion}
        onSave={() => setRefreshTrigger((prev) => prev + 1)}
      />

      {/* 削除ダイアログ */}
      <DeleteCombinationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        combination={matchingCombination}
        materials={materials}
        onDelete={() => {
          setRefreshTrigger((prev) => prev + 1);
          onReset?.();
        }}
      />
    </animated.div>
  );
}
