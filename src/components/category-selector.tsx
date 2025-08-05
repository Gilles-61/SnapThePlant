
"use client";

import { Leaf, TreeDeciduous, Sprout, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from '@/hooks/use-language';

export const categories = [
  { name: 'Plant', icon: Leaf, hintKey: 'categories.plantHint' },
  { name: 'Tree', icon: TreeDeciduous, hintKey: 'categories.treeHint' },
  { name: 'Weed', icon: Sprout, hintKey: 'categories.weedHint' },
  { name: 'Insect', icon: Bug, hintKey: 'categories.insectHint' },
] as const;

export type Category = typeof categories[number]['name'];

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  className?: string;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
  className,
}: CategorySelectorProps) {
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <div className={cn("flex justify-center items-center gap-3 p-2 bg-black/30 backdrop-blur-md rounded-full", className)}>
        {categories.map(({ name, icon: Icon, hintKey }) => (
          <Tooltip key={name} delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-20 h-20 flex flex-col gap-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300",
                  selectedCategory === name && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground scale-110"
                )}
                onClick={() => onSelectCategory(name)}
                aria-label={t(hintKey)}
                aria-pressed={selectedCategory === name}
              >
                <Icon className="w-7 h-7" />
                <span className="text-sm font-medium">{t(`categories.${name.toLowerCase()}`)}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/80 text-white border-0">
              <p>{t(hintKey)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
