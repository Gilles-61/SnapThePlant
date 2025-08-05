import { Leaf, TreeDeciduous, Sprout, Bug } from 'lucide-react';

export const categories = [
  { name: 'Plant', icon: Leaf, hintKey: 'categories.plantHint', colorClass: 'category-tile-plant' },
  { name: 'Tree', icon: TreeDeciduous, hintKey: 'categories.treeHint', colorClass: 'category-tile-tree' },
  { name: 'Weed', icon: Sprout, hintKey: 'categories.weedHint', colorClass: 'category-tile-weed' },
  { name: 'Insect', icon: Bug, hintKey: 'categories.insectHint', colorClass: 'category-tile-insect' },
] as const;

export type Category = typeof categories[number]['name'];
