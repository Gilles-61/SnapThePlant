
"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from '@/hooks/use-language';
import type { Category } from '@/lib/categories';
import { categories } from '@/lib/categories';


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
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-4 p-2", className)}>
        {categories.map(({ name, icon: Icon, hintKey, colorClass }) => (
          <Tooltip key={name} delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "rounded-lg w-28 h-28 flex flex-col items-center justify-center gap-2 text-base font-semibold shadow-md transition-all duration-200 ease-in-out hover:transform hover:scale-105 hover:shadow-lg",
                  colorClass,
                  selectedCategory === name && "ring-4 ring-offset-2 ring-primary transform scale-105 shadow-xl"
                )}
                onClick={() => onSelectCategory(name)}
                aria-label={t(hintKey)}
                aria-pressed={selectedCategory === name}
              >
                <Icon className="w-8 h-8" />
                <span>{t(`categories.${name.toLowerCase()}`)}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-popover text-popover-foreground border-border">
              <p>{t(hintKey)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
