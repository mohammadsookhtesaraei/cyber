import Link from 'next/link';

import { Eye } from 'lucide-react';

import { IPayment } from '@/types/payment-interface';

import { toLocalStringShortDate } from '@/utils/toPersianDate';
import { toPersianNumbersWithComma } from '@/utils/toPersianNumber';

import { adminPaymentListTableTHeads } from '@/constant/tableHeads';

type PaymentListTableProps = {
  payments: IPayment[];
};

function PaymentTable({ payments }: PaymentListTableProps) {
  return (
    <div className="my-8 w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-200 border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {adminPaymentListTableTHeads.map((item) => (
              <th
                className="h-14 border-b border-gray-200 px-5 text-center text-xs font-semibold whitespace-nowrap text-gray-500"
                key={item.id}
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {payments.map((payment, index) => (
            <tr
              key={payment._id}
              className="group transition-colors duration-200 hover:bg-gray-50"
            >
              <td className="border-b border-gray-100 px-5 py-4 text-center text-gray-600">
                {index + 1}
              </td>

              <td className="border-b border-gray-100 px-5 py-4 text-center font-medium whitespace-nowrap text-gray-700">
                {payment.invoiceNumber}
              </td>

              <td className="max-w-70 truncate border-b border-gray-100 px-5 py-4 text-center text-gray-600">
                {payment.description}
              </td>

              <td className="border-b border-gray-100 px-5 py-4 text-center">
                <div className="flex min-w-40 flex-col items-center gap-y-2">
                  <span className="font-medium text-gray-800">
                    {payment.user.name}
                  </span>

                  <span className="text-xs text-gray-500">
                    {payment.user.email}
                  </span>

                  <span className="text-xs font-semibold text-gray-700">
                    {payment.user.phoneNumber}
                  </span>
                </div>
              </td>

              <td className="border-b border-gray-100 px-5 py-4 text-center">
                <div className="flex min-w-35 flex-col items-center gap-y-2">
                  {payment.cart.productDetail.map((product) => (
                    <span
                      className="inline-flex max-w-full rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"

                      key={product._id}
                    >
                      {product.title}
                    </span>
                  ))}
                </div>
              </td>

              <td className="border-b border-gray-100 px-5 py-4 text-center text-base font-bold whitespace-nowrap text-gray-800">
                {toPersianNumbersWithComma(payment.amount)}
              </td>

              <td className="border-b border-gray-100 px-5 py-4 text-center whitespace-nowrap text-gray-600">
                {toLocalStringShortDate(payment.createdAt)}
              </td>

              <td className="border-b border-gray-100 px-5 py-4 text-center">
                {payment.status === 'COMPLETED' ? (
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    موفق
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                    ناموفق
                  </span>
                )}
              </td>

              <td className="border-b border-gray-100 px-5 py-4 text-center">
                <div className="flex items-center justify-center">
                  <Link
                    href={`/admin/payments/${payment._id}`}
                    aria-label="مشاهده جزئیات پرداخت"
                    className="hover:text-primary-900 flex size-8 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-gray-100"
                  >
                    <Eye className="size-5" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
