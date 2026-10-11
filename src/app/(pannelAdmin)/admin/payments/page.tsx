'use client';

import PaymentTable from './components/PaymentTable';
import { RotatingLines } from 'react-loader-spinner';

import { useGetPayments } from '@/hook/usePayment';

const Payments = () => {
  const { data, isPending } = useGetPayments();
  const { payments } = data || {};

  if (isPending) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          color="green"
          strokeWidth="3"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  return (
    <div className="px-4">
      <PaymentTable payments={payments} />
    </div>
  );
};
export default Payments;
