export const toLocalStringShortDate = (date?: string | Date): string => {
  const createDate = new Date(date ?? '').toLocaleDateString('fa-IR', {
    // weekday:"long",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return createDate;
};
