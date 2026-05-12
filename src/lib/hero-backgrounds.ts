const HERO_BACKGROUNDS = [
  'bailong-elevator-zhangjiajie.jpg',
  'beijing-mutianyu-great-wall.jpg',
  'black-dragon-pool_497419.jpg',
  'chengdu.jpg',
  'forbidden-city.jpg',
  'glass-bridge-grand-canyon-zhangjiajie.jpg',
  'guilin.jpg',
  'halong-bay.jpg',
  'shanghai-bund1_0940232.jpg',
  'songzanlin-monastery.jpg',
  'west-lake_092845.jpg',
  'zhangjiajie-forest-park-wulingyuan.jpg',
  'zhangjiajie-forest-park.jpg',
  'zhangjiajie-glass-bridge-grand-canyon.jpg',
  'zhangjiajie1_435319.jpg',
  'zhangjiajiebg.jpg',
];

const BASE_URL = 'https://static.tripcngo.com/';

export function getRandomHeroBg(): string {
  const index = Math.floor(Math.random() * HERO_BACKGROUNDS.length);
  return BASE_URL + HERO_BACKGROUNDS[index];
}
