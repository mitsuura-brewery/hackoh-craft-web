'use client';

import { NutritionFacts } from '@/types/fermentation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Clock, Lightbulb } from 'lucide-react';

interface NutritionPanelProps {
  nutritionFacts: NutritionFacts;
  fermentationPeriod: number;
  recommendation: string;
}

export default function NutritionPanel({
  nutritionFacts,
  fermentationPeriod,
  recommendation,
}: NutritionPanelProps) {
  const hasData = nutritionFacts.calories > 0;

  const panelSpring = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
  });

  const nutritionItems = [
    {
      label: 'カロリー',
      value: nutritionFacts.calories.toFixed(1),
      unit: 'kcal',
      color: 'ferment-primary',
    },
    {
      label: 'タンパク質',
      value: nutritionFacts.protein.toFixed(1),
      unit: 'g',
      color: 'protein-primary',
    },
    {
      label: '炭水化物',
      value: nutritionFacts.carbohydrate.toFixed(1),
      unit: 'g',
      color: 'koji-primary',
    },
    { label: '脂質', value: nutritionFacts.fat.toFixed(1), unit: 'g', color: 'ferment-secondary' },
    {
      label: 'ナトリウム',
      value: nutritionFacts.sodium.toFixed(0),
      unit: 'mg',
      color: 'ferment-accent',
    },
    { label: '食物繊維', value: nutritionFacts.fiber.toFixed(1), unit: 'g', color: 'ferment-dark' },
  ];

  return (
    <animated.div style={panelSpring}>
      <div className="flex flex-col items-center p-6 min-w-[375px]">
        <AnimatePresence mode="wait">
          {hasData ? (
            <motion.div
              key="nutrition-data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* 栄養成分リスト */}
              <div className="grid grid-cols-2 gap-3">
                {nutritionItems.map((item, index) => (
                  <NutritionItem key={item.label} {...item} index={index} />
                ))}
              </div>

              {/* 発酵期間 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-ferment-primary/10 rounded-2xl p-4 border border-ferment-primary/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-ferment-primary" size={20} />
                  <h3 className="font-semibold text-ferment-primary">発酵期間</h3>
                </div>
                <p className="text-2xl font-bold text-ferment-primary">{fermentationPeriod}日</p>
              </motion.div>

              {/* 推奨メッセージ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-ferment-accent/10 rounded-2xl p-4 border border-ferment-accent/20"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="text-ferment-accent mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-ferment-accent mb-1">おすすめ</h3>
                    <p className="text-sm text-ferment-dark leading-relaxed">{recommendation}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="no-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📊
              </motion.div>
              <p className="text-ferment-secondary/60">
                材料を選択すると
                <br />
                成分表が表示されます
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </animated.div>
  );
}

interface NutritionItemProps {
  label: string;
  value: string;
  unit: string;
  color: string;
  index: number;
}

function NutritionItem({ label, value, unit, color, index }: NutritionItemProps) {
  const itemSpring = useSpring({
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    delay: index * 100,
  });

  return (
    <animated.div style={itemSpring}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/60 rounded-xl p-3 border border-ferment-light/50 hover:border-ferment-light transition-all"
      >
        <div className="text-xs text-ferment-secondary/80 mb-1 font-medium">{label}</div>
        <div className="flex items-baseline gap-1">
          <span className={`text-lg font-bold text-${color}`}>{value}</span>
          <span className="text-sm text-ferment-secondary/70">{unit}</span>
        </div>
      </motion.div>
    </animated.div>
  );
}
