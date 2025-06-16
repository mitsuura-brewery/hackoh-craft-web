'use client';

import { Material } from '@/types/fermentation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, useSpringValue, useTransition } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

interface CompoundDisplayProps {
  selectedMaterials: Material[];
  fermentationPeriod: number;
}

export default function CompoundDisplay({ selectedMaterials, fermentationPeriod }: CompoundDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  const containerSpring = useSpring({
    opacity: selectedMaterials.length > 0 ? 1 : 0.3,
    transform: selectedMaterials.length > 0 ? 'scale(1)' : 'scale(0.9)',
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
          
          points.push([
            centerX + Math.cos(angle) * r,
            centerY + Math.sin(angle) * r
          ]);
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
        const { width, height } = container.getBoundingClientRect();
        setDimensions({ width: Math.min(width, 400), height: Math.min(height, 400) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <animated.div 
      style={containerSpring}
      className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-ferment-light min-h-[400px] flex flex-col items-center justify-center"
    >
      <h2 className="text-2xl font-bold text-ferment-primary mb-6 text-center">
        発酵化合物
      </h2>

      <div className="relative flex-1 flex items-center justify-center w-full">
        {/* オーガニック境界線のキャンバス */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 pointer-events-none"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* 材料アイコンの配置 */}
        <div 
          className="relative"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height 
          }}
        >
          <AnimatePresence>
            {transitions((style, material, _, index) => {
              if (!material || selectedMaterials.length === 0) return null;
              
              // 材料を円形に配置
              const angle = (index / selectedMaterials.length) * Math.PI * 2;
              const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
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
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                    className="text-3xl filter drop-shadow-lg"
                  >
                    {material.icon}
                  </motion.div>
                </animated.div>
              );
            })}
          </AnimatePresence>
        </div>

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
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🧪
            </motion.div>
            <p className="text-center text-sm">
              材料を選んで<br />
              発酵化合物を作ろう
            </p>
          </motion.div>
        )}
      </div>

      {/* 発酵期間の表示 */}
      <AnimatePresence>
        {selectedMaterials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 text-center"
          >
            <div className="bg-ferment-primary/10 rounded-full px-4 py-2 border border-ferment-primary/20">
              <p className="text-ferment-primary font-semibold">
                発酵期間: {fermentationPeriod}日
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </animated.div>
  );
}