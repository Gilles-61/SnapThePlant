"use client";

import { Leaf, TreeDeciduous, Sprout, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export const categories = [
  { name: 'Plant', icon: Leaf, hint: 'Identify a plant' },
  { name: 'Tree', icon: TreeDeciduous, hint: 'Identify a tree' },
  { name: 'Weed', icon: Sprout, hint: 'Identify a weed' },
  { name: 'Insect', icon: Bug, hint: 'Identify an insect' },
] as const;

export type Category = typeof categories[number]['name'];

interface CategorySelectorProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  className?: string;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
  className,
}: CategorySelectorProps) {
  return (
    <TooltipProvider>
      <div className={cn("flex justify-center items-center gap-3 p-2 bg-black/30 backdrop-blur-md rounded-full", className)}>
        {categories.map(({ name, icon: Icon, hint }) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-16 h-16 flex flex-col gap-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300",
                  selectedCategory === name && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground scale-110"
                )}
                onClick={() => onSelectCategory(name)}
                aria-label={hint}
                aria-pressed={selectedCategory === name}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/80 text-white border-0">
              <p>{hint}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
