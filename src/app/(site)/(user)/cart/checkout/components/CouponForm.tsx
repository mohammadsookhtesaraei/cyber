'use client';

import { Check, Tag, Trash2 } from 'lucide-react';

type CouponFormProps = {
  code: string;
  onCodeChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  appliedCode: string | null;
  isLoading: boolean;
  error: string | null;
};

const CouponForm = ({
  code,
  onCodeChange,
  onApply,
  onRemove,
  appliedCode,
  isLoading,
  error,
}: CouponFormProps) => {
  const isApplied = Boolean(appliedCode);

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Tag size={20} className="text-gray-600" />

        <h3 className="font-semibold text-gray-800">کد تخفیف</h3>
      </div>

      {isApplied ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <Check size={18} />

            <span>
              کد تخفیف <strong>{appliedCode}</strong> اعمال شد.
            </span>
          </div>

          <button
            type="button"
            onClick={onRemove}
            disabled={isLoading}
            className="flex shrink-0 items-center gap-1 text-sm text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            حذف
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={code}
            onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();

                if (code.trim() && !isLoading) {
                  onApply();
                }
              }
            }}
            placeholder="کد تخفیف را وارد کنید"
            disabled={isLoading}
            aria-label="کد تخفیف"
            aria-invalid={Boolean(error)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />

          <button
            type="button"
            onClick={onApply}
            disabled={isLoading || !code.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'در حال بررسی...' : 'اعمال کد'}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
};

export default CouponForm;
