import { Material } from '@/types/material';

export const WHEAT_KOJI: Material = {
  id: 'wheat',
  name: '小麦麹',
  shortName: '小麦麹',
  category: 'koji',
  icon: './img/wheat.png',
  thumbnail: '/materials/wheat-koji.jpg',
  description: '小麦を麹菌で発酵させた発酵触媒',
  parameters: {
    weight: 270,
    moisture: 15.0,
    moistureAmount: 40.5,
    salt: 0.0,
    saltAmount: 0.0,
    pH: 6.1,
    protein: 27.3,
    fat: 4.9,
    starch: 196.3,
  },
  colors: {
    primary: '#F4E4BC',
    light: '#FFF8DC',
    background: '#F5DEB3',
    border: '#D2B48C',
  },
  shopifyVariantId: '', // To be filled when product is created
};