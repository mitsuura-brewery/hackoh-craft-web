import { describe, it, expect } from 'vitest';
import { calculateMaterialSpecs } from '../material';
import { Material } from '@/types/material';
import { SOYBEAN, RICE_KOJI } from '@/constants/materials';

describe('calculateMaterialSpecs', () => {
  it('should calculate material specs correctly with soybean and rice koji', () => {
    const materials: Material[] = [
      SOYBEAN,
      RICE_KOJI,
    ];

    const result = calculateMaterialSpecs(materials, 6, '関東');

    expect(result).toEqual({
      kojiRatio: 4,
      waterAmount: 0,
      saltRatio: 11.4,
      totalWeight: 1030,
      materialPeriod: 111,
      moistureRatio: 43.8
    });
  });
});