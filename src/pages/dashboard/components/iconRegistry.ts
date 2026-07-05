import {
  Tag,
  Shirt,
  ShoppingBag,
  IceCream,
  Cookie,
  Pill,
  BookOpen,
  Smartphone,
  Watch,
  Gem,
  Home,
  Car,
  Baby,
  Dumbbell,
  Book,
  Coffee,
  Utensils,
  Gift,
  Star,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Tag,
  Shirt,
  ShoppingBag,
  IceCream,
  Cookie,
  Pill,
  BookOpen,
  Smartphone,
  Watch,
  Gem,
  Home,
  Car,
  Baby,
  Dumbbell,
  Book,
  Coffee,
  Utensils,
  Gift,
  Star,
  Sparkles,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export function getCategoryIcon(name?: string): LucideIcon {
  return (name && CATEGORY_ICONS[name]) || Tag;
}

export const CATEGORY_COLORS = [
  '#2563eb',
  '#059669',
  '#dc2626',
  '#7c3aed',
  '#d97706',
  '#db2777',
  '#0891b2',
  '#65a30d',
];
