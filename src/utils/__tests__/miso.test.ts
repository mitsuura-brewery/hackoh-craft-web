import { describe, it, expect } from 'vitest';
import { getSimilarMisoInfo, MisoInfo } from '../miso';
import { MaterialSpecs } from '../material';
import { Material } from '@/types/material';
import { SOYBEAN, RICE_KOJI, BARLEY_KOJI, CHICKPEA } from '@/constants/materials';
import { KAGA, KYUSHU_AWASE, SATSUMA_MUGI } from '@/constants/misos';

interface TestCase {
  name: string;
  materials: Material[];
  specs: MaterialSpecs;
  expected: MisoInfo | null;
}

const createSpecs = (
  kojiRatio: number,
  saltRatio: number,
  waterAmount: number = 0,
  totalWeight: number = 1000,
  materialPeriod: number = 30,
  moistureRatio: number = 45,
): MaterialSpecs => ({
  kojiRatio,
  waterAmount,
  saltRatio,
  totalWeight,
  materialPeriod,
  moistureRatio,
});

const materials = (
  soybeanCount: number,
  chickpeaCount: number,
  riceKojiCount: number,
  barleyKojiCount: number,
): Material[] => [
  ...Array(soybeanCount).fill(SOYBEAN),
  ...Array(chickpeaCount).fill(CHICKPEA),
  ...Array(riceKojiCount).fill(RICE_KOJI),
  ...Array(barleyKojiCount).fill(BARLEY_KOJI),
];

describe('getSimilarMisoInfo', () => {
  const testCases: TestCase[] = [
    {
      name: '九州合わせ味噌 - 完全一致',
      materials: materials(1, 0, 1, 1), // 大豆、米麹、麦麹
      specs: createSpecs(25, 11.5), // kojiRatio=25, saltRatio=11.5%
      expected: KYUSHU_AWASE,
    },
    {
      name: '加賀味噌 - 完全一致',
      materials: materials(1, 0, 1, 0), // 大豆、米麹のみ
      specs: createSpecs(10, 12.3), // kojiRatio=10, saltRatio=12.3%
      expected: KAGA,
    },
    {
      name: '薩摩麦味噌 - 完全一致',
      materials: materials(1, 0, 0, 1), // 大豆、麦麹のみ
      specs: createSpecs(25, 10.7), // kojiRatio=25, saltRatio=10.7%
      expected: SATSUMA_MUGI,
    },
    {
      name: '九州合わせ味噌 - 塩分境界値（上限）',
      materials: materials(1, 0, 1, 1), // 大豆、米麹、麦麹
      specs: createSpecs(25, 12.5), // saltRatio=12.5% (11.5+1.0)
      expected: KYUSHU_AWASE,
    },
    {
      name: '九州合わせ味噌 - 塩分境界値（下限）',
      materials: materials(1, 0, 1, 1), // 大豆、米麹、麦麹
      specs: createSpecs(25, 10.5), // saltRatio=10.5% (11.5-1.0)
      expected: KYUSHU_AWASE,
    },
    {
      name: '加賀味噌 - 麹歩合境界値（上限）',
      materials: materials(1, 0, 1, 0), // 大豆、米麹のみ
      specs: createSpecs(13, 12.3), // kojiRatio=13 (10+3)
      expected: KAGA,
    },
    {
      name: '加賀味噌 - 麹歩合境界値（下限）',
      materials: materials(1, 0, 1, 0), // 大豆、米麹のみ
      specs: createSpecs(7, 12.3), // kojiRatio=7 (10-3)
      expected: KAGA,
    },
    {
      name: '材料なし',
      materials: materials(0, 0, 0, 0),
      specs: createSpecs(0, 0),
      expected: null,
    },
    {
      name: '塩分範囲外（九州合わせ味噌）',
      materials: materials(1, 0, 1, 1), // 大豆、米麹、麦麹
      specs: createSpecs(25, 13.6), // saltRatio=13.6% (11.5+2.1, 範囲外)
      expected: null,
    },
    {
      name: 'タンパク質構成不一致（ひよこ豆使用）',
      materials: materials(0, 1, 1, 0), // ひよこ豆、米麹
      specs: createSpecs(10, 12.3),
      expected: null,
    },
    {
      name: '麹歩合範囲外（加賀味噌）',
      materials: materials(1, 0, 1, 0), // 大豆、米麹のみ
      specs: createSpecs(16, 12.3), // kojiRatio=16 (10+6, 範囲外)
      expected: null,
    },
    {
      name: '麹構成不一致（米麹のみで九州合わせ味噌を期待）',
      materials: materials(1, 0, 1, 0), // 大豆、米麹のみ（麦麹なし）
      specs: createSpecs(25, 11.5),
      expected: null,
    },
    {
      name: '複数材料の組み合わせ（大豆2個、米麹2個）',
      materials: materials(2, 0, 2, 0), // 大豆2個、米麹2個
      specs: createSpecs(10, 11.3), // 実際の計算結果に基づく
      expected: KAGA,
    },
  ];

  testCases.forEach((testCase) => {
    it(`should return correct miso info for ${testCase.name}`, () => {
      const result = getSimilarMisoInfo(testCase.materials, testCase.specs);
      expect(result).toEqual(testCase.expected);
    });
  });
});
