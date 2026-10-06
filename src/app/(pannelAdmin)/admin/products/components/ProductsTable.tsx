import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';

import { Eye, Pencil, Trash } from 'lucide-react';

import axios from 'axios';

import toast from 'react-hot-toast';

import { useRemoveProduct } from '@/hook/useProducts';

import { IProduct } from '@/types/product-interface';

import {
  toPersianNumbers,
  toPersianNumbersWithComma,
} from '@/utils/toPersianNumber';

import { productListTableTHeads } from '@/constant/tableHeads';

type ProductsTableProps = { products: IProduct[] };
const ProductsTable = ({ products }: ProductsTableProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync: removeProduct, isPending } = useRemoveProduct();
  const removeProductHandler = async (id: string) => {
    try {
      const { message } = await removeProduct(id);
      toast.success(message);
      await queryClient.invalidateQueries({ queryKey: ['get-products'] });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'خطا در حذف محصول');
      }
    }
  };
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-200 border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="bg-gray-50">
            {productListTableTHeads.map((item) => (
              <th
                key={item.id}
                className="h-14 border-b border-gray-200 px-5 text-center text-xs font-semibold whitespace-nowrap text-gray-500"
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr
              key={item._id.toString()}
              className="group transition-colors duration-200 hover:bg-gray-50"
            >
              <td className="border-b border-gray-100 px-5 py-4 text-center text-xs font-medium text-gray-400">
                {index + 1}
              </td>
              <td className="border-b border-gray-100 px-5 py-4 text-center font-semibold whitespace-nowrap text-gray-800">
                {item.title}
              </td>
              <td className="max-w-70 border-b border-gray-100 px-5 py-4 text-center text-gray-500">
                <span className="line-clamp-1">{item.category?.title}</span>
              </td>
              <td className="border-b border-gray-100 px-5 py-4 text-center font-medium whitespace-nowrap text-gray-600">
                {toPersianNumbersWithComma(item.price)}
              </td>
              <td className="border-b border-gray-100 px-5 py-4 text-center">
                {toPersianNumbers(item.discount)}%
              </td>
              <td className="border-b border-gray-100 px-5 py-4 text-center">
                {toPersianNumbersWithComma(item.offPrice)}
              </td>
              <td className="border-b border-gray-100 px-5 py-4 text-center">
                {toPersianNumbers(
                  item.countInStock > 0 ? item.countInStock : 0
                )}
              </td>
              <td className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-center gap-x-4">
                  <Link
                    href={`/admin/products/${item._id}`}
                    className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => removeProductHandler(item._id.toString())}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-rose-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash size={16} />
                  </button>
                  <Link
                    href={`/admin/products/edit/${item._id}`}
                    className="flex size-8 items-center justify-center rounded-lg text-blue-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil size={16} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ProductsTable;
