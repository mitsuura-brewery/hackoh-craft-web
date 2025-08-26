import { Material } from '@/types/material';
import { MaterialSpecs } from './material';
import { KYUSHU_AWASE, KAGA, SATSUMA_MUGI } from '@/constants/misos';

export interface MisoInfo {
  name: string;
  period: number;
  image: string;
  saltRange: number;
  proteins: string[];
  kojiRatio: number;
  kojiRequire: string[];
}

// 予め定義されたご当地味噌の情報
const LOCAL_MISO_DATA: MisoInfo[] = [KYUSHU_AWASE, KAGA, SATSUMA_MUGI];

/**
 * 選択された材料から最も近しいご当地味噌の情報を返す
 * @param selectedMaterials 選択された材料の配列
 * @param specs 材料の仕様計算結果
 * @returns 最も近しい味噌の情報、または null
 */
export function getSimilarMisoInfo(
  selectedMaterials: Material[],
  specs: MaterialSpecs,
): MisoInfo | null {
  if (selectedMaterials.length === 0) {
    return null;
  }

  // 選択された材料の構成を分析（重複を除去）
  const kojiMaterials = selectedMaterials.filter((material) => material.category === 'koji');
  const proteinMaterials = selectedMaterials.filter((material) => material.category === 'protein');

  const selectedKojiNames = [...new Set(kojiMaterials.map((material) => material.name))];
  const selectedProteinNames = [...new Set(proteinMaterials.map((material) => material.name))];

  // 条件に合致する味噌を検索
  for (const miso of LOCAL_MISO_DATA) {
    // 塩分範囲チェック（前後1%以内）
    const saltMatches = Math.abs(specs.saltRatio - miso.saltRange) <= 1;

    // タンパク質構成チェック（種類の一致、数量は問わない）
    const proteinMatches =
      selectedProteinNames.length === miso.proteins.length &&
      selectedProteinNames.every((name) => miso.proteins.includes(name)) &&
      miso.proteins.every((name) => selectedProteinNames.includes(name));

    // 麹歩合チェック（前後3以内）
    const kojiRatioMatches = Math.abs(specs.kojiRatio - miso.kojiRatio) <= 3;

    // 麹構成チェック（種類の一致、数量は問わない）
    const kojiMatches =
      selectedKojiNames.length === miso.kojiRequire.length &&
      selectedKojiNames.every((name) => miso.kojiRequire.includes(name)) &&
      miso.kojiRequire.every((name) => selectedKojiNames.includes(name));

    // すべての条件が一致する場合
    if (saltMatches && proteinMatches && kojiRatioMatches && kojiMatches) {
      return miso;
    }
  }

  // 条件に合致する味噌がない場合はnullを返す
  return null;
}
