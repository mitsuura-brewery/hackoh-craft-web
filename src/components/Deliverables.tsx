import Image from 'next/image';
import { Material } from '@/types/fermentation';
import NutritionPanel from '@/components/NutritionPanel';
import { calculateFermentation } from '@/utils/fermentation';

interface DeliverablesProps {
  selectedMaterials: Material[];
}

export default function Deliverables({ selectedMaterials }: DeliverablesProps) {
  const calculation = calculateFermentation(selectedMaterials);
  const hasMaterials = selectedMaterials.length > 0;

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

  return (
    <div className="w-full min-h-[200px] flex gap-16 mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden shadow-lg flex-shrink-0">
        <Image
          src={hasMaterials && info ? getImageSrc() : '/img/kyushu-awase.jpg'}
          alt={hasMaterials && info ? info.name : '味噌のイメージ'}
          fill
          className="object-cover"
          sizes="180px"
        />
        {(!hasMaterials || !info) && <div className="absolute inset-0 bg-white/70"></div>}
      </div>
      <div>
        {/* メインの説明文 */}
        <div className="mb-6 text-center">
          <p className="text-lg text-ferment-dark leading-relaxed">
            {hasMaterials && info ? (
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

        {/* 仕様一覧 */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">麹歩合</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials && info ? '10' : ''}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">加水量</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials && info ? '10' : ''}
                <span className="text-sm text-ferment-secondary">ml</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">塩分</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials && info ? '13' : ''}
                <span className="text-sm text-ferment-secondary">%</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">重量</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials && info ? '810' : ''}
                <span className="text-sm text-ferment-secondary">g</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ferment-secondary mb-1">期間目安</p>
              <p className="text-xl font-bold text-ferment-dark">
                {hasMaterials && info ? '120' : ''}
                <span className="text-sm text-ferment-secondary">日</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
