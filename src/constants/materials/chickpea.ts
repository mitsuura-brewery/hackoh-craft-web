import { Material } from '@/types/material';

export const CHICKPEA: Material = {
  id: 'chickpea',
  name: 'ひよこ豆',
  shortName: 'ひよこ豆',
  category: 'protein',
  icon: './img/chickpeas.png',
  thumbnail: '/materials/chickpea.jpg',
  description: 'ひよこ豆を使用した発酵素材',
  parameters: {
    weight: 760,
    moisture: 54.0,
    moistureAmount: 410.4,
    salt: 15.5,
    saltAmount: 117.8,
    pH: 6.4,
    protein: 54.5,
    fat: 16.4,
    starch: 122.7,
  },
  colors: {
    primary: '#f4e654',
    light: '#f9f19e',
    background: '#f4e654',
    border: '#c4b320',
  },
  shopifyVariantId: '45123753115804',
};
