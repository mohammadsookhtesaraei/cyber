import { Minus, Plus, Trash2 } from 'lucide-react';

import {
  useDecreaseCartItem,
  useDeleteCartItem,
  useIncreaseCartItem,
} from '@/hook/useCart';

type QuantityControlProps = {
  quantity: number;
  id: string;
};

const QuantityControl = ({ quantity, id }: QuantityControlProps) => {
  const { mutate: increase, isPending: isIncreasing } = useIncreaseCartItem();

  const { mutate: decrease, isPending: isDecreasing } = useDecreaseCartItem();

  const { mutate: remove, isPending: isDeleting } = useDeleteCartItem();

  const isPending = isIncreasing || isDecreasing || isDeleting;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-1">
        <button
          type="button"
          aria-label="افزایش تعداد"
          disabled={isPending}
          onClick={() => increase(id)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />
        </button>

        <span className="min-w-5 text-center text-sm font-semibold text-gray-800">
          {quantity.toLocaleString('fa-IR')}
        </span>

        <button
          type="button"
          aria-label="کاهش تعداد"
          disabled={isPending}
          onClick={() => decrease(id)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus size={16} />
        </button>
      </div>

      <button
        type="button"
        aria-label="حذف محصول"
        disabled={isPending}
        onClick={() => remove(id)}
        className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default QuantityControl;
