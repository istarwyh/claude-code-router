import { BaseCardRenderer } from '../../shared/renderers/BaseCardRenderer';
import type { PracticeCard } from '../types/PracticeCard';
import { categoryIcons } from '../data/categoryConfig';

export class CardRenderer extends BaseCardRenderer<PracticeCard> {
  constructor() {
    super(categoryIcons);
  }
}
