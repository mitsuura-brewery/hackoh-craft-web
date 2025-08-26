import { Material } from '@/types/material';

export const BARLEY_KOJI: Material = {
  id: 'barley-koji',
  name: '麦麹',
  shortName: '麦麹',
  category: 'koji',
  icon: './img/wheat.png',
  thumbnail: '/materials/barley-koji.jpg',
  description: '麦を麹菌で発酵させた発酵触媒',
  parameters: {
    weight: 270,
    moisture: 15.0,
    moistureAmount: 40.5,
    salt: 0.0,
    saltAmount: 0.0,
    pH: 6.0,
    protein: 23.2,
    fat: 5.5,
    starch: 190.9,
  },
  colors: {
    primary: '#e8c794',
    light: '#d4944a',
    background: '#b46c1f',
    border: '#9a5a18',
  },
  shopifyVariantId: '45123755770012',
};
