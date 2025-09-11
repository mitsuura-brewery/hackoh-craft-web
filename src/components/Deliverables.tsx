import Image from 'next/image';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import { Material, MaterialCategory } from '@/types/material';
import { calculateMaterialSpecs } from '@/utils/material';
import { getSimilarMisoInfo } from '@/utils/miso';
import AnimatedNumber from '@/components/AnimatedNumber';
import SlideInText from '@/components/SlideInText';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

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
    // specs: MaterialSpecs,
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
  const messageInfo = getMessageInfo(selectedMaterials);

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
    <div className="w-full flex items-center sm:items-start flex-col-reverse sm:flex-row sm:gap-8 gap-4 mx-auto bg-white md:rounded-lg shadow-md py-8 px-4 sm:p-8 w-max-[320px]">
      <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden shadow-lg flex-shrink-0">
        <Image
          src={hasMaterials && misoInfo ? misoInfo.image : './img/kyushu-awase.jpg'}
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
        <div className="w-full">
          <div className="grid grid-cols-3 md:grid-cols-5 w-full gap-2 justify-between mb-4">
            {renderSpec(hasMaterials, '麹歩合', specs.kojiRatio, '', 0.1)}
            {renderSpec(hasMaterials, '加水量', specs.waterAmount, 'ml', 0.2)}
            {renderSpec(hasMaterials, '塩分', specs.saltRatio, '%', 0.3)}
            {renderSpec(hasMaterials, '重量', specs.totalWeight, 'g', 0.4)}
            {renderSpec(hasMaterials, '期間目安', specs.materialPeriod, '日', 0.5)}
          </div>

          {/* 詳細情報（アコーディオン形式） */}
          {hasMaterials && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="text-sm text-ferment-secondary justify-center">
                  詳細な成分・酵素情報
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 pt-2">
                    {renderSpec(true, 'たんぱく質', specs.totalProtein, 'g', 0)}
                    {renderSpec(true, '脂質', specs.totalFat, 'g', 0)}
                    {renderSpec(true, 'でんぷん', specs.totalStarch, 'g', 0)}
                    {renderSpec(true, '水分', specs.moistureRatio, '%', 0)}
                    {renderSpec(true, '対水食塩濃度', specs.saltConcentration, '%', 0)}
                    {renderSpec(true, '初期pH', specs.initialPH, '', 0)}
                    {renderSpec(true, 'αアミラーゼ', specs.averageAlphaAmylase, '', 0)}
                    {renderSpec(true, 'グルコアミラーゼ', specs.averageGlucoAmylase, '', 0)}
                    {renderSpec(true, 'プロテアーゼ', specs.averageProtease, '', 0)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}

const renderSpec = (enable: boolean, label: string, value: number, unit: string, delay: number) => {
  // 塩分の場合は小数点下1桁まで表示
  const displayValue = label === '塩分' ? Math.round(value * 10) / 10 : value;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <p
        className={cn('text-ferment-secondary mb-1', label.length < 7 ? 'text-sm' : 'text-[11px]')}
      >
        {label}
      </p>
      <p className="text-xl font-bold text-ferment-dark">
        {enable ? (
          <>
            <AnimatedNumber value={displayValue} />
            <span className="text-sm text-ferment-secondary">{unit}</span>
          </>
        ) : (
          '-'
        )}
      </p>
    </motion.div>
  );
};
