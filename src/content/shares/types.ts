export type ShareStatus = 'draft' | 'public' | 'archived';

export type ShareLocale = 'zh-CN' | 'en-US';

export type DeckImageFormat = 'webp';

export type ShareResourceKind = 'pdf' | 'pptx' | 'transcript';

export type ShareResourceMediaType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'text/markdown; charset=utf-8';

export type ShareAuthor = {
  name: string;
};

export type ShareEvent = {
  name: string;
  location: string;
};

export type ShareResource = {
  kind: ShareResourceKind;
  label: string;
  url: string;
  fileName: string;
  mediaType: ShareResourceMediaType;
};

export type ShareDeckPaths = {
  cover: string;
  slides: string;
  thumbnails: string;
  manifest: string;
  pdf: string;
  pptx: string;
  transcript: string;
};

export type ShareSlide = {
  number: number;
  title: string;
  description: string;
  transcript: string;
};

export type ShareDeck = {
  kind: 'deck';
  version: string;
  baseUrl: string;
  slideCount: number;
  slideWidth: number;
  slideHeight: number;
  imageFormat: DeckImageFormat;
  paths: ShareDeckPaths;
  slides: readonly ShareSlide[];
};

export type Share = {
  slug: string;
  status: ShareStatus;
  locale: ShareLocale;
  title: string;
  subtitle?: string;
  summary: string;
  description: string;
  author: ShareAuthor;
  event: ShareEvent;
  location: string;
  eventDate?: string;
  publishedAt: string;
  updatedAt: string;
  tags: readonly string[];
  coverPath: string;
  coverAlt: string;
  resources: readonly ShareResource[];
  deck?: ShareDeck;
};

export type DeckArtifact = ShareDeck;
export type DeckAssetPaths = ShareDeckPaths;
export type DeckSlide = ShareSlide;
