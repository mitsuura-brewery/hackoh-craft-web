import Image from 'next/image';
import { Material } from '@/types/fermentation';

interface DeliverablesProps {
  selectedMaterials: Material[];
}

export default function Deliverables({ selectedMaterials }: DeliverablesProps) {
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
  if (!info) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden shadow-lg flex-shrink-0">
          <Image src={getImageSrc()} alt={info.name} fill className="object-cover" sizes="180px" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-ferment-secondary">
            その組み合わせだと、<span className="font-semibold">{info.period}ヶ月</span>ぐらいに
            <span className="font-bold text-ferment-primary">{info.name}</span>
            と近いものができあがります
          </p>
        </div>
      </div>
    </div>
  );
}
