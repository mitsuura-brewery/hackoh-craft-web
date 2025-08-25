import { Material } from '@/types/material';

export const SOYBEAN: Material = {
  id: 'soybean',
  name: '大豆',
  shortName: '大豆',
  category: 'protein',
  icon: '/img/soy.png',
  thumbnail: '/materials/soybean.jpg',
  description: '大豆を使用した発酵素材',
  parameters: {
    weight: 760,
    moisture: 54.0,
    moistureAmount: 410.4,
    salt: 15.5,
    saltAmount: 117.8,
    pH: 6.3,
    protein: 98.2,
    fat: 54.5,
    starch: 81.8,
  },
  colors: {
    primary: '#f8cc99',
    light: '#fce8d1',
    background: '#f8cc99',
    border: '#e6b17a',
  },
  shopifyVariantId: '45123752296604',
};