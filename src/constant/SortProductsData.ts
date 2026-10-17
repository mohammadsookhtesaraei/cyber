type SortType = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'rating';

export type SortOptionType = {
  id: number;
  value: SortType;
  label: string;
};

export const sortOption: SortOptionType[] = [
  { id: 1, value: 'newest', label: 'جدیدترین' },
  { id: 2, value: 'oldest', label: 'قدیمی‌ترین' },
  { id: 4, value: 'price-asc', label: 'ارزان‌ترین' },
  { id: 5, value: 'price-desc', label: 'گران‌ترین' },
  { id: 6, value: 'rating', label: 'بالاترین امتیاز' },
];
