import { describe, it, expect } from 'vitest';
import { calculateMaterialSpecs, MaterialSpecs } from '../material';
import { Material } from '@/types/material';
import { SOYBEAN, RICE_KOJI, BARLEY_KOJI, CHICKPEA } from '@/constants/materials';

interface TestCase {
  name: string;
  materials: Material[];
  month: number;
  region: string;
  expected: {
    kojiRatio: number;
    waterAmount: number;
    saltRatio: number;
    totalWeight: number;
    materialPeriod: number;
    moistureRatio: number;
  };
}

const expected = (
  koji: number,
  water: number,
  weight: number,
  moisture: number,
  salt: number,
  period: number,
): MaterialSpecs => {
  return {
    kojiRatio: koji,
    waterAmount: water,
    totalWeight: weight,
    moistureRatio: moisture,
    saltRatio: salt,
    materialPeriod: period,
  };
};

const materials = (
  soybeanCount: number,
  chickpeaCount: number,
  riceKojiCount: number,
  barleyKojiCount: number,
): Material[] => {
  return [
    ...Array(soybeanCount).fill(SOYBEAN),
    ...Array(chickpeaCount).fill(CHICKPEA),
    ...Array(riceKojiCount).fill(RICE_KOJI),
    ...Array(barleyKojiCount).fill(BARLEY_KOJI),
  ];
};

describe('calculateMaterialSpecs', () => {
  const testCases: TestCase[] = [
    {
      name: 'basic-soybeanCount-only',
      materials: materials(1, 0, 0, 0), // 大豆1個
      month: 6,
      region: '関東',
      expected: expected(0, 0, 760.0, 54.0, 15.5, 0),
    },
    {
      name: 'basic-chickpeaCount-only',
      materials: materials(0, 1, 0, 0), // ひよこ豆1個
      month: 6,
      region: '関東',
      expected: expected(0, 0, 760.0, 54.0, 15.5, 0),
    },
    {
      name: 'basic-riceKoji-only',
      materials: materials(0, 0, 1, 0), // 米麹1個
      month: 6,
      region: '関東',
      expected: expected(0, 0, 270.0, 15.0, 0.0, 0),
    },
    {
      name: 'basic-barleyKoji-only',
      materials: materials(0, 0, 0, 1), // 麦麹1個
      month: 6,
      region: '関東',
      expected: expected(0, 0, 270.0, 15.0, 0.0, 0),
    },
    {
      name: 'basic-kojiRatio-5',
      materials: materials(2, 0, 1, 0), // 大豆2個, 米麹1個
      month: 6,
      region: '関東',
      expected: expected(5, 0, 1790.0, 48.1, 13.2, 180),
    },
    {
      name: 'basic-kojiRatio-10',
      materials: materials(1, 0, 1, 0), // 大豆1個, 米麹1個
      month: 6,
      region: '関東',
      expected: expected(10, 0, 1030, 43.8, 11.4, 90),
    },
    {
      name: 'basic-kojiRatio-15',
      materials: materials(2, 0, 3, 0), // 大豆2個, 米麹3個
      month: 6,
      region: '関東',
      expected: expected(15, 150, 2480.0, 44.0, 9.5, 60),
    },
    {
      name: 'basic-kojiRatio-20',
      materials: materials(1, 0, 2, 0), // 大豆1個, 米麹2個
      month: 6,
      region: '関東',
      expected: expected(20, 150, 1450.0, 44.2, 8.1, 45),
    },
    {
      name: 'basic-kojiRatio-25',
      materials: materials(2, 0, 5, 0), // 大豆2個, 米麹5個
      month: 6,
      region: '関東',
      expected: expected(25, 430, 3300.0, 44.0, 7.1, 36),
    },
    {
      name: 'basic-kojiRatio-30',
      materials: materials(1, 0, 3, 0), // 大豆1個, 米麹3個
      month: 6,
      region: '関東',
      expected: expected(30, 290, 1860.0, 44.2, 6.3, 30),
    },
    {
      name: 'basic-kojiRatio-35',
      materials: materials(2, 0, 7, 0), // 大豆2個, 米麹7個
      month: 6,
      region: '関東',
      expected: expected(35, 710, 4120.0, 44.0, 5.7, 26),
    },
    {
      name: 'basic-kojiRatio-40',
      materials: materials(1, 0, 4, 0), // 大豆1個, 米麹4個
      month: 6,
      region: '関東',
      expected: expected(40, 430, 2270.0, 44.2, 5.2, 23),
    },
    {
      name: 'basic-kojiRatio-45',
      materials: materials(2, 0, 9, 0), // 大豆2個, 米麹9個
      month: 6,
      region: '関東',
      expected: expected(45, 990, 4940.0, 44.0, 4.8, 20),
    },
    {
      name: 'basic-kojiRatio-50',
      materials: materials(1, 0, 5, 0), // 大豆1個, 米麹5個
      month: 6,
      region: '関東',
      expected: expected(50, 570, 2680.0, 44.1, 4.4, 18),
    },
  ];

  testCases.forEach((testCase) => {
    it(`should calculate material specs correctly for ${testCase.name}`, () => {
      const result = calculateMaterialSpecs(testCase.materials, testCase.month, testCase.region);

      if (testCase.name === 'basic-barleyKoji-only') {
        console.log('BARLEY_KOJI weight param:', BARLEY_KOJI.parameters.weight);
        console.log('Calculation result:', result);
      }

      expect(result).toEqual(testCase.expected);
    });
  });
});
