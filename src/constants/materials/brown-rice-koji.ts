import { Material } from '@/types/material';

export const BROWN_RICE_KOJI: Material = {
  id: 'brown-rice',
  name: '玄米麹',
  shortName: '玄米麹',
  category: 'koji',
  icon: './img/brown-rice.png',
  thumbnail: '/materials/brown-rice.jpg',
  description: '玄米を麹菌で発酵させた発酵触媒',
  parameters: {
    weight: 270,
    moisture: 15.0,
    moistureAmount: 40.5,
    salt: 0.0,
    saltAmount: 0.0,
    pH: 6.3,
    protein: 20.5,
    fat: 6.0,
    starch: 185.4,
  },
  colors: {
    primary: '#8B4513',
    light: '#DEB887',
    background: '#F5DEB3',
    border: '#A0522D',
  },
  shopifyVariantId: '', // To be filled when product is created
};