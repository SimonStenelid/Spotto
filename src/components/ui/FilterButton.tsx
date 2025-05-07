import React from 'react';
import { 
  Filter,
  Coffee,
  UtensilsCrossed,
  Wine,
  Palette,
  Target,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMapStore, PLACE_CATEGORIES, type PlaceCategory } from '@/store/useMapStore';
import { motion, AnimatePresence } from 'framer-motion';

// Category icons and labels
const CATEGORY_CONFIG: Record<PlaceCategory, { icon: React.ElementType; label: string }> = {
  cafe: { icon: Coffee, label: 'Cafes' },
  restaurant: { icon: UtensilsCrossed, label: 'Restaurants' },
  bar: { icon: Wine, label: 'Bars' },
  cultural: { icon: Palette, label: 'Cultural' },
  activity: { icon: Target, label: 'Activities' },
  shopping: { icon: ShoppingBag, label: 'Shopping' }
};

interface FilterButtonProps {
  className?: string;
}

export function FilterButton({ className }: FilterButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedCategories, toggleCategory, clearCategories } = useMapStore();

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className={cn(
          "h-10 w-10 rounded-full border-none bg-white hover:bg-gray-50 relative",
          selectedCategories.length > 0 && "after:absolute after:top-0 after:right-0 after:w-2.5 after:h-2.5 after:bg-black after:rounded-full",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <Filter className="h-4 w-4 text-gray-700" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filter by category</h3>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={() => clearCategories()}
              >
                Clear all
              </Button>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="grid grid-cols-2 gap-3 p-1">
              {PLACE_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const config = CATEGORY_CONFIG[category];
                const IconComponent = config.icon;
                
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-auto py-4 px-3 flex flex-col items-center gap-2 transition-all",
                      isSelected && "bg-black text-white hover:bg-gray-900",
                      !isSelected && "hover:bg-gray-50"
                    )}
                    onClick={() => toggleCategory(category)}
                  >
                    <IconComponent className="h-6 w-6" strokeWidth={1.5} />
                    <span className="text-sm font-medium capitalize">
                      {config.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
} 