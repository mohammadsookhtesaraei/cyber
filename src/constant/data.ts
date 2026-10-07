export type AdminRoute = {
  title: string;
  href: string;
  icon?: string;
  children?: {
    title: string;
    href: string;
  }[];
};

export const adminRoutes: AdminRoute[] = [
  {
    title: 'داشبورد',
    href: '/admin',
    icon: '🏠',
    children: [
      {
        title: 'خانه',
        href: '/',
      },
      {
        title: 'داشبورد',
        href: '/admin',
      },
    ],
  },

  {
    title: 'دسته‌بندی‌ها',
    href: '/admin/categories',
    icon: '🗂️',
    children: [
      { title: 'دسته بندی ها', href: '/admin/categories' },
      { title: 'افزودن دسته بندی', href: '/admin/categories/add' },
    ],
  },
  {
    title: 'محصولات',
    href: '/admin/products',
    icon: '📦',
    children: [
      {
        title: 'همه محصولات',
        href: '/admin/products',
      },
      {
        title: 'افزودن محصول',
        href: '/admin/products/add',
      },
    ],
  },
  {
    title: 'سفارشات',
    href: '/admin/orders',
    icon: '🛒',
    children: [
      {
        title: 'همه سفارشات',
        href: '/admin/orders',
      },
      {
        title: 'در انتظار پرداخت',
        href: '/admin/orders/pending',
      },
      {
        title: 'در حال پردازش',
        href: '/admin/orders/processing',
      },
      {
        title: 'ارسال شده',
        href: '/admin/orders/shipped',
      },
      {
        title: 'تحویل داده شده',
        href: '/admin/orders/delivered',
      },
      {
        title: 'لغو شده',
        href: '/admin/orders/cancelled',
      },
    ],
  },
  {
    title: 'کاربران',
    href: '/admin/users',
    icon: '👥',
    children: [
      {
        title: 'همه کاربران',
        href: '/admin/users',
      },
      {
        title: 'کاربران فعال',
        href: '/admin/users/active',
      },
      {
        title: 'مدیران',
        href: '/admin/users/admins',
      },
    ],
  },
  {
    title: 'پرداخت‌ها',
    href: '/admin/payments',
    icon: '💳',
    children: [
      {
        title: 'همه پرداخت‌ها',
        href: '/admin/payments',
      },
      {
        title: 'پرداخت‌های موفق',
        href: '/admin/payments/success',
      },
      {
        title: 'پرداخت‌های ناموفق',
        href: '/admin/payments/failed',
      },
    ],
  },
  {
    title: 'تخفیف‌ها',
    href: '/admin/discounts',
    icon: '🎟️',
    children: [
      {
        title: 'همه کدهای تخفیف',
        href: '/admin/discounts',
      },
      {
        title: 'افزودن کد تخفیف',
        href: '/admin/discounts/add',
      },
    ],
  },
  {
    title: 'نظرات',
    href: '/admin/reviews',
    icon: '⭐',
    children: [
      {
        title: 'همه نظرات',
        href: '/admin/reviews',
      },
      {
        title: 'در انتظار تأیید',
        href: '/admin/reviews/pending',
      },
      {
        title: 'تأیید شده',
        href: '/admin/reviews/approved',
      },
    ],
  },
  {
    title: 'تیکت‌ها',
    href: '/admin/tickets',
    icon: '🎫',
    children: [
      {
        title: 'همه تیکت‌ها',
        href: '/admin/tickets',
      },
      {
        title: 'باز',
        href: '/admin/tickets/open',
      },
      {
        title: 'در حال بررسی',
        href: '/admin/tickets/review',
      },
      {
        title: 'بسته شده',
        href: '/admin/tickets/closed',
      },
    ],
  },
  {
    title: 'تنظیمات',
    href: '/admin/settings',
    icon: '⚙️',
    children: [
      {
        title: 'پروفایل من',
        href: '/admin/settings/profile',
      },
      {
        title: 'امنیت',
        href: '/admin/settings/security',
      },
    ],
  },
];
