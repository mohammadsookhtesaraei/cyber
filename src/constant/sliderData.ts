type SliderData = {
  id: number;
  title: string;
  linkText: string;
  img: string;
  img2?: string;
  bgcolor: string;
  color?: string;
  self?: string;
};

export const sliderData: SliderData[] = [
  {
    id: 1,
    title: 'مک بوک پرو',
    img: '/images/slide1.webp',
    linkText: 'مشاهده',
    bgcolor: '#2C2C2C',
    color: '#ffffff',
    self: 'start',
  },
  {
    id: 2,
    title: 'سامسونگ گلگسی',
    img: '/images/slide2.webp',
    linkText: 'مشاهده',
    bgcolor: '#EAEAEA',
    self: 'center',
  },
  {
    id: 3,
    title: 'ای پد پرو',
    img: '/images/slide3.webp',
    linkText: 'مشاهده',
    bgcolor: '#F9F9F9',
    self: 'start',
  },
  {
    id: 4,
    title: 'محبوب ترین محصولات',
    img: '/images/slide4.webp',
    img2: '/images/slide42.webp',
    linkText: 'مشاهده',
    bgcolor: '#ffffff',
    self: 'center',
  },
];
