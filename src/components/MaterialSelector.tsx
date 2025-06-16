'use client';

import { Material } from '@/types/fermentation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterials: Material[];
  onMaterialSelect: (material: Material) => void;
  onClearAll: () => void;
}

export default function MaterialSelector({
  materials,
  selectedMaterials,
  onMaterialSelect,
  onClearAll
}: MaterialSelectorProps) {
  const clearButtonSpring = useSpring({
    opacity: selectedMaterials.length > 0 ? 1 : 0,
    transform: selectedMaterials.length > 0 ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 10 }
  });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-ferment-light">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ferment-primary">材料を選ぶ</h2>
        <animated.button
          style={clearButtonSpring}
          onClick={onClearAll}
          className="flex items-center gap-2 px-3 py-2 bg-ferment-secondary/10 hover:bg-ferment-secondary/20 rounded-full transition-colors text-ferment-secondary"
          disabled={selectedMaterials.length === 0}
        >
          <Trash2 size={16} />
          <span className="text-sm">クリア</span>
        </animated.button>
      </div>

      <div className="space-y-4">
        {/* タンパク質材料 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-protein-primary">
            タンパク質ペースト
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {materials
              .filter(material => material.category === 'protein')
              .map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  isSelected={selectedMaterials.some(m => m.id === material.id)}
                  onSelect={() => onMaterialSelect(material)}
                />
              ))
            }
          </div>
        </div>

        {/* 麹材料 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-koji-primary">
            麹菌
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {materials
              .filter(material => material.category === 'koji')
              .map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  isSelected={selectedMaterials.some(m => m.id === material.id)}
                  onSelect={() => onMaterialSelect(material)}
                />
              ))
            }
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMaterials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-4 border-t border-ferment-light/50"
          >
            <p className="text-sm text-ferment-secondary mb-2">
              選択中の材料: {selectedMaterials.length}個
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedMaterials.map(material => (
                <motion.span
                  key={material.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-ferment-accent/20 text-ferment-dark rounded-full text-xs"
                >
                  <span>{material.icon}</span>
                  <span>{material.name}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MaterialCardProps {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
}

function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  const cardSpring = useSpring({
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isSelected 
      ? '0 10px 25px rgba(139, 69, 19, 0.3)' 
      : '0 4px 15px rgba(139, 69, 19, 0.1)',
    config: { tension: 300, friction: 10 }
  });

  const categoryColor = material.category === 'protein' 
    ? 'protein-primary' 
    : 'koji-primary';

  return (
    <animated.button
      style={cardSpring}
      onClick={onSelect}
      className={clsx(
        'group relative p-4 rounded-2xl transition-all duration-300 text-left w-full',
        'bg-white border-2 hover:shadow-lg',
        isSelected 
          ? `border-${categoryColor} bg-${categoryColor}/5`
          : 'border-ferment-light/50 hover:border-ferment-light'
      )}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ 
            rotate: isSelected ? [0, -5, 5, 0] : 0,
            scale: isSelected ? 1.2 : 1
          }}
          transition={{ duration: 0.5 }}
          className="text-2xl"
        >
          {material.icon}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h4 className={clsx(
            'font-semibold text-sm mb-1',
            `text-${categoryColor}`
          )}>
            {material.name}
          </h4>
          <p className="text-xs text-ferment-dark/70 leading-relaxed">
            {material.description}
          </p>
          
          <div className="mt-2 text-xs text-ferment-secondary/80">
            {material.category === 'protein' && (
              <span>タンパク質 {material.parameters.protein}%</span>
            )}
            {material.category === 'koji' && (
              <span>酵素活性 {material.parameters.enzyme}</span>
            )}
          </div>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={clsx(
            'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold',
            `bg-${categoryColor}`
          )}
        >
          ✓
        </motion.div>
      )}
    </animated.button>
  );
}