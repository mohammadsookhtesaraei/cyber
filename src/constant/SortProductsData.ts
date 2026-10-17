export type SortOptionType = {
  id: number;
  value: string;
  label: string;
};

export const sortOption: SortOptionType[] = [
  { id: 1, value: 'latest', label: 'جدیدترین' },
  { id: 2, value: 'earliest', label: 'قدیمی‌ترین' },
  {
    id: 3,
    value: 'papular',
    label: 'محبوب‌ترین',
  },
];
