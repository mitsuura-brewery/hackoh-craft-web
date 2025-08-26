import { BARLEY_KOJI, SOYBEAN } from '@/constants/materials';
import { MisoInfo } from '@/utils/miso';

export const SATSUMA_MUGI: MisoInfo = {
  name: '薩摩麦味噌',
  period: 2,
  image: '/img/satsuma-mugi.jpg',
  saltRange: 10.7,
  proteins: [SOYBEAN.name],
  kojiRatio: 25,
  kojiRequire: [BARLEY_KOJI.name],
};