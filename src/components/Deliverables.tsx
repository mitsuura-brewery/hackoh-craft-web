import Image from 'next/image';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import { Material, MaterialCategory } from '@/types/fermentation';
import { calculateFermentationSpecs } from '@/utils/fermentation';

interface DeliverablesProps {
  selectedMaterials: Material[];
  selectedMonth: number;
  selectedRegion: string;
}

export default function Deliverables({
  selectedMaterials,
  selectedMonth,
  selectedRegion,
}: DeliverablesProps) {
  const specs = calculateFermentationSpecs(selectedMaterials, selectedMonth, selectedRegion);
  const hasMaterials = selectedMaterials.length > 0;

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

  const getImageSrc = () => {
    const kojiMaterials = selectedMaterials.filter((material) => material.category === 'koji');
    const hasRiceKoji = kojiMaterials.some((material) => material.id === 'rice-koji');
    const hasBarleyKoji = kojiMaterials.some((material) => material.id === 'barley-koji');

    if (hasRiceKoji && hasBarleyKoji) {
      return '/img/kyushu-awase.jpg';
    } else if (hasRiceKoji) {
      return '/img/kaga.jpg';
    } else if (hasBarleyKoji) {
      return '/img/satsuma-mugi.jpg';
    }

    return '/img/kaga.jpg';
  };

  const getMisoInfo = () => {
    const kojiMaterials = selectedMaterials.filter((material) => material.category === 'koji');
    const hasRiceKoji = kojiMaterials.some((material) => material.id === 'rice-koji');
    const hasBarleyKoji = kojiMaterials.some((material) => material.id === 'barley-koji');

    if (hasRiceKoji && hasBarleyKoji) {
      return {
        name: '九州合わせ味噌',
        period: 1,
      };
    } else if (hasRiceKoji) {
      return {
        name: '加賀味噌',
        period: 6,
      };
    } else if (hasBarleyKoji) {
      return {
        name: '薩摩麦味噌',
        period: 2,
      };
    }

    return null;
  };

  const info = getMisoInfo();
  const warningMessage = getWarningMessage(selectedMaterials);

  return (
    <div className="w-full flex gap-8 mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden shadow-lg flex-shrink-0">
        <Image
          src={hasMaterials && info ? getImageSrc() : '/img/kyushu-awase.jpg'}
          alt={hasMaterials && info ? info.name : '味噌のイメージ'}
          fill
          className="object-cover"
        />
        {(!hasMaterials || !info) && <div className="absolute inset-0 bg-white/70"></div>}
      </div>
      <div className="flex flex-col gap-4 w-full min-h-[200px]">
        {/* メインの説明文 */}
        <div className="min-h-[60px]">
          <p className="text-lg text-ferment-dark leading-relaxed">
            {warningMessage ? (
              <span className="text-red-700">⚠️ {warningMessage}</span>
            ) : hasMaterials && info ? (
              <>
                この組み合わせは
                <span className="font-bold text-ferment-primary">12月（今から4ヶ月）</span>ごろに
                <br />
                <span className="font-bold text-ferment-primary">薩摩麦味噌</span>
                と似た成分の味噌ができあがります
              </>
            ) : (
              'できあがりのシミュレーション結果を確認できます'
            )}
          </p>
        </div>

        {/* 選択中の材料一覧（キャンバス上端にabsolute配置） */}
        <div className="flex min-h-[30px]">
          <AnimatePresence>
            {selectedMaterials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-wrap justify-center gap-2"
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

        {/* 仕様一覧 */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">麹歩合</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? specs.kojiRatio || '-' : ''}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">加水量</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? specs.waterAmount || '-' : ''}
                {hasMaterials && specs.waterAmount > 0 && (
                  <span className="text-sm text-ferment-secondary">ml</span>
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">塩分</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? specs.saltRatio || '-' : ''}
                {hasMaterials && specs.saltRatio > 0 && (
                  <span className="text-sm text-ferment-secondary">%</span>
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">重量</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? specs.totalWeight || '-' : ''}
                {hasMaterials && specs.totalWeight > 0 && (
                  <span className="text-sm text-ferment-secondary">g</span>
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">期間目安</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? specs.fermentationPeriod || '-' : ''}
                {hasMaterials && specs.fermentationPeriod > 0 && (
                  <span className="text-sm text-ferment-secondary">日</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
