import { BARLEY_KOJI, RICE_KOJI, SOYBEAN } from '@/constants/materials';
import { MisoInfo } from '@/utils/miso';

export const KYUSHU_AWASE: MisoInfo = {
  name: '九州合わせ味噌',
  period: 1,
  image: '/img/kyushu-awase.jpg',
  saltRange: 11.5,
  proteins: [SOYBEAN.name],
  kojiRatio: 25,
  kojiRequire: [RICE_KOJI.name, BARLEY_KOJI.name],
};