'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const getPages = (): (number | 'dots')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 'dots', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        'dots',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      'dots',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'dots',
      totalPages,
    ];
  };

  const pages = getPages();

  const buttonClass =
    'flex h-10 min-w-10 items-center justify-center rounded-xl border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav
      dir="ltr"
      aria-label="صفحه‌بندی محصولات"
      className="my-2 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="صفحه قبلی"
        className={`${buttonClass} border-gray-200 bg-white text-gray-700 hover:bg-gray-100`}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) =>
        page === 'dots' ? (
          <span
            key={`dots-${index}`}
            className="flex h-10 w-8 items-center justify-center text-gray-400"
            aria-hidden="true"
          >
            <MoreHorizontal size={18} />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            aria-label={`صفحه ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`${buttonClass} ${
              currentPage === page
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="صفحه بعدی"
        className={`${buttonClass} border-gray-200 bg-white text-gray-700 hover:bg-gray-100`}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
