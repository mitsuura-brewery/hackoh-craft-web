import Image from 'next/image';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import { Material, MaterialCategory } from '@/types/material';
import { calculateMaterialSpecs } from '@/utils/material';
import { getSimilarMisoInfo } from '@/utils/miso';
import AnimatedNumber from '@/components/AnimatedNumber';
import SlideInText from '@/components/SlideInText';

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
  const specs = calculateMaterialSpecs(selectedMaterials, selectedMonth, selectedRegion);
  const hasMaterials = selectedMaterials.length > 0;

  // メッセージとアイコンを判定する関数
  const getMessageInfo = (
    materials: Material[],
    specs: MaterialSpecs,
  ): { message: string; type: 'info' | 'warning' } => {
    if (materials.length === 0) {
      return {
        message: 'できあがりのシミュレーション結果を確認できます',
        type: 'info',
      };
    }

    const materialCounts = materials.reduce((acc, material) => {
      acc[material.category] = (acc[material.category] || 0) + 1;
      return acc;
    }, {} as Record<MaterialCategory, number>);

    const proteinCount = materialCounts.protein || 0;
    const kojiCount = materialCounts.koji || 0;

    // タンパク質のみ選んでいる場合
    if (proteinCount > 0 && kojiCount === 0) {
      return {
        message: '麹を最低１袋は選んでください。',
        type: 'warning',
      };
    }

    // 麹のみ選んでいる場合
    if (kojiCount > 0 && proteinCount === 0) {
      return {
        message: 'タンパク質を最低１袋は選んでください。',
        type: 'warning',
      };
    }

    return {
      message: '',
      type: 'info',
    };
  };

  const misoInfo = getSimilarMisoInfo(selectedMaterials, specs);
  const messageInfo = getMessageInfo(selectedMaterials, specs);

  // 完成予定日を計算
  const getCompletionInfo = () => {
    if (!hasMaterials) return null;

    const days = specs.materialPeriod;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + days);

    const year = completionDate.getFullYear();
    const month = completionDate.getMonth() + 1;

    return { days, year, month };
  };

  const completionInfo = getCompletionInfo();

  return (
    <div className="w-full flex items-center flex-col-reverse sm:flex-row sm:gap-8 gap-4 mx-auto bg-white md:rounded-lg shadow-md p-8 w-max-[320px]">
      <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden shadow-lg flex-shrink-0">
        <Image
          src={hasMaterials && misoInfo ? misoInfo.image : '/img/kyushu-awase.jpg'}
          alt={hasMaterials && misoInfo ? misoInfo.name : '味噌のイメージ'}
          fill
          className="object-cover"
        />
        {(!hasMaterials || !misoInfo) && <div className="absolute inset-0 bg-white/70"></div>}
      </div>
      <div className="flex flex-col gap-4 w-full min-h-[200px] items-center">
        {/* メインの説明文 */}
        <div className="min-h-[60px]">
          <AnimatePresence mode="wait">
            {messageInfo.type === 'warning' ? (
              <SlideInText
                key="warning"
                direction="left"
                className="text-ferment-dark leading-relaxed"
              >
                <span className="text-red-700">⚠️ {messageInfo.message}</span>
              </SlideInText>
            ) : messageInfo.type === 'info' && messageInfo.message ? (
              <SlideInText
                key="info"
                direction="left"
                className="text-ferment-dark leading-relaxed"
              >
                <span className="text-blue-700">ℹ️ {messageInfo.message}</span>
              </SlideInText>
            ) : hasMaterials ? (
              <SlideInText
                key="result"
                direction="left"
                className="text-lg text-ferment-dark leading-relaxed"
              >
                <span className="font-bold text-xl text-ferment-primary mx-1">
                  {completionInfo
                    ? `${completionInfo.days}日後（${completionInfo.year}年${completionInfo.month}月）ぐらい`
                    : '4ヶ月後（2025年12月）ぐらい'}
                </span>
                に
                <br />
                {misoInfo ? (
                  <>
                    <span className="font-bold text-ferment-primary text-xl mx-1">
                      {misoInfo.name}
                    </span>
                    に似た味噌ができます
                  </>
                ) : (
                  <>この成分の味噌ができあがります</>
                )}
              </SlideInText>
            ) : null}
          </AnimatePresence>
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
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm text-ferment-secondary mb-1">麹歩合</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? <AnimatedNumber value={specs.kojiRatio} /> : '-'}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-ferment-secondary mb-1">加水量</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? (
                  <>
                    <AnimatedNumber value={specs.waterAmount} />
                    <span className="text-sm text-ferment-secondary">ml</span>
                  </>
                ) : (
                  '-'
                )}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-ferment-secondary mb-1">塩分</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? (
                  <>
                    <AnimatedNumber value={specs.saltRatio} />
                    <span className="text-sm text-ferment-secondary">%</span>
                  </>
                ) : (
                  '-'
                )}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-ferment-secondary mb-1">重量</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? (
                  <>
                    <AnimatedNumber value={specs.totalWeight} />
                    <span className="text-sm text-ferment-secondary">g</span>
                  </>
                ) : (
                  '-'
                )}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-ferment-secondary mb-1">期間目安</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials ? (
                  <>
                    <AnimatedNumber value={specs.materialPeriod} />
                    <span className="text-sm text-ferment-secondary">日</span>
                  </>
                ) : (
                  '-'
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
