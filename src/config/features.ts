import type { MetadataRoute } from 'next';
import { UI_TEXTS } from '@/config/ui-texts';

export type FeatureKind = 'route' | 'section';
export type HomeSectionId = 'home' | 'get-started' | 'ai-wireframe';

export type FeaturePage = {
  id: string;
  title: string;
  href: string;
  kind: FeatureKind;
  isPublic: boolean;
  showInHomeMenu: boolean;
  sitemapPriority?: number;
  sitemapChangeFrequency?: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
};

export const DEFAULT_HOME_SECTION_ID: HomeSectionId = 'home';

const HOME_SECTION_IDS = ['home', 'get-started', 'ai-wireframe'] satisfies readonly HomeSectionId[];

export const featurePages: readonly FeaturePage[] = [
  {
    id: 'home',
    title: UI_TEXTS.NAVIGATION.HOME,
    href: '/',
    kind: 'route',
    isPublic: true,
    showInHomeMenu: true,
    sitemapPriority: 1,
    sitemapChangeFrequency: 'weekly',
  },
  {
    id: 'get-started',
    title: UI_TEXTS.NAVIGATION.GET_STARTED,
    href: '/#get-started',
    kind: 'section',
    isPublic: true,
    showInHomeMenu: true,
  },
  {
    id: 'ai-wireframe',
    title: UI_TEXTS.NAVIGATION.AI_WIREFRAME,
    href: '/#ai-wireframe',
    kind: 'section',
    isPublic: true,
    showInHomeMenu: true,
  },
  {
    id: 'whiteboard',
    title: UI_TEXTS.NAVIGATION.WHITEBOARD,
    href: '/whiteboard',
    kind: 'route',
    isPublic: true,
    showInHomeMenu: true,
    sitemapPriority: 0.6,
    sitemapChangeFrequency: 'monthly',
  },
  {
    id: 'playground',
    title: UI_TEXTS.NAVIGATION.PLAYGROUND,
    href: '/playground',
    kind: 'route',
    isPublic: true,
    showInHomeMenu: true,
    sitemapPriority: 0.8,
    sitemapChangeFrequency: 'monthly',
  },
  {
    id: 'recording-summary',
    title: UI_TEXTS.NAVIGATION.RECORDING_SUMMARY,
    href: '/recording-summary',
    kind: 'route',
    isPublic: true,
    showInHomeMenu: true,
    sitemapPriority: 0.7,
    sitemapChangeFrequency: 'monthly',
  },
  {
    id: 'shares',
    title: UI_TEXTS.NAVIGATION.SHARES,
    href: '/shares',
    kind: 'route',
    isPublic: true,
    showInHomeMenu: true,
    sitemapPriority: 0.8,
    sitemapChangeFrequency: 'monthly',
  },
  {
    id: 'brand',
    title: UI_TEXTS.NAVIGATION.BRAND,
    href: '/brand',
    kind: 'route',
    isPublic: true,
    showInHomeMenu: false,
    sitemapPriority: 0.7,
    sitemapChangeFrequency: 'monthly',
  },
];

export const homeSectionFeatures = featurePages.filter(
  (feature): feature is FeaturePage & { id: HomeSectionId } => feature.showInHomeMenu && isHomeSectionId(feature.id),
);

export const homeUtilityFeatures = featurePages.filter(
  feature => feature.showInHomeMenu && feature.kind === 'route' && feature.href !== '/',
);

export function isHomeSectionId(value: string): value is HomeSectionId {
  return HOME_SECTION_IDS.some(sectionId => sectionId === value);
}
