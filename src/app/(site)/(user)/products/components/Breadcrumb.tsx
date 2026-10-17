import Link from 'next/link';

import { ChevronLeft, Home } from 'lucide-react';

const Breadcrumb = () => {
  return (
    <nav aria-label="مسیر صفحه" className="py-5">
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-black"
          >
            <Home size={16} />
            <span>خانه</span>
          </Link>
        </li>

        <li aria-hidden="true">
          <ChevronLeft size={16} className="text-gray-400" />
        </li>

        <li>
          <span aria-current="page" className="font-medium text-gray-900">
            محصولات
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
