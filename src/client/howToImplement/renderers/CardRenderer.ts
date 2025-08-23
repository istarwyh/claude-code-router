import { BaseCardRenderer } from '../../shared/renderers/BaseCardRenderer';
import type { ImplementCard } from '../../shared/types/ContentCard';
import { categoryIcons } from '../data/categoryConfig';

export class HowToImplementCardRenderer extends BaseCardRenderer<ImplementCard> {
  constructor() {
    super(categoryIcons);
  }
}