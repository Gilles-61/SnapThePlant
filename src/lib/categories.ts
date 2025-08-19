import { Leaf, TreeDeciduous, Sprout, Bug, Bird } from 'lucide-react';
import { CactusIcon } from '@/components/icons/cactus-icon';
import { SucculentIcon } from '@/components/icons/succulent-icon';

export const categories = [
  { name: 'Plant', icon: Leaf, hintKey: 'categories.plantHint', colorClass: 'category-tile-plant' },
  { name: 'Tree', icon: TreeDeciduous, hintKey: 'categories.treeHint', colorClass: 'category-tile-tree' },
  { name: 'Weed', icon: Sprout, hintKey: 'categories.weedHint', colorClass: 'category-tile-weed' },
  { name: 'Insect', icon: Bug, hintKey: 'categories.insectHint', colorClass: 'category-tile-insect' },
  { name: 'Cactus', icon: CactusIcon, hintKey: 'categories.cactusHint', colorClass: 'category-tile-cactus' },
  { name: 'Succulent', icon: SucculentIcon, hintKey: 'categories.succulentHint', colorClass: 'category-tile-succulent' },
  { name: 'Bird', icon: Bird, hintKey: 'categories.birdHint', colorClass: 'category-tile-bird' },
] as const;

export type Category = typeof categories[number]['name'];
