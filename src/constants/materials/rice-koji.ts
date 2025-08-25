import { Material } from '@/types/material';

export const RICE_KOJI: Material = {
  id: 'rice-koji',
  name: '米麹',
  shortName: '米麹',
  category: 'koji',
  icon: '/img/rice.png',
  thumbnail: '/materials/rice-koji.jpg',
  description: '米を麹菌で発酵させた発酵触媒',
  parameters: {
    weight: 270,
    moisture: 15.0,
    moistureAmount: 40.5,
    salt: 0.0,
    saltAmount: 0.0,
    pH: 6.2,
    protein: 18.3,
    fat: 4.1,
    starch: 204.5,
  },
  colors: {
    primary: '#d0e4e8',
    light: '#e8f4f6',
    background: '#d0e4e8',
    border: '#b8d1d6',
  },
  shopifyVariantId: '45123754885276',
};