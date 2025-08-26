import { RICE_KOJI, SOYBEAN } from '@/constants/materials';
import { MisoInfo } from '@/utils/miso';

export const KAGA: MisoInfo = {
  name: '加賀味噌',
  period: 6,
  image: '/img/kaga.jpg',
  saltRange: 12.3,
  proteins: [SOYBEAN.name],
  kojiRatio: 10,
  kojiRequire: [RICE_KOJI.name],
};