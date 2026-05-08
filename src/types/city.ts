export interface CityData {
  id: string;
  name: string;
  enName: string;
  heroImage: string;
  listCover?: string;
  tags: { text: string; enText?: string; color: string }[];
  paragraphs: string[];
  enParagraphs?: string[];
  stats: {
    wantToVisit: number;
    recommended: number;
  };
  info: {
    area: string;
    population: string;
  };
  bestTravelTime: {
    strongText: string;
    enStrongText?: string;
    paragraphs: string[];
    enParagraphs?: string[];
  };
  history: {
    year: string;
    enYear?: string;
    title: string;
    enTitle?: string;
    desc: string;
    enDesc?: string;
  }[];
  attractions: {
    name: string;
    enName: string;
    desc: string;
    enDesc?: string;
    price: string;
    enPrice?: string;
    season: string;
    enSeason?: string;
    time: string;
    enTime?: string;
    rating?: string;
    imageUrl?: string;
  }[];
  worldHeritage?: {
    name: string;
    enName?: string;
    year: string;
    enYear?: string;
    desc: string;
    enDesc?: string;
  }[];
  intangibleHeritage?: {
    name: string;
    enName?: string;
    year: string;
    enYear?: string;
    desc: string;
    enDesc?: string;
    imageUrl: string;
  }[];
  transportation: {
    iconName: string;
    title: string;
    enTitle?: string;
    desc: string;
    enDesc?: string;
    price: string;
    enPrice?: string;
  }[];
  food: {
    name: string;
    enName?: string;
    pinyin: string;
    price: string;
    desc: string;
    enDesc?: string;
    ingredients: string;
    enIngredients?: string;
    imageIdx: number;
    imageUrl?: string;
  }[];
}
