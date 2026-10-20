import { MapPin, Phone } from 'lucide-react';

import type { OrderDetailAddress } from '@/hook/useOrder';

type OrderAddressProps = {
  address: OrderDetailAddress;
};

export default function OrderAddress({ address }: OrderAddressProps) {
  return (
    <section className="mb-5 rounded-xl border bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 font-bold">
        <MapPin size={20} />
        اطلاعات گیرنده
      </h2>

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <p>نام: {address.fullName}</p>

        <p className="flex items-center gap-2">
          <Phone size={16} />
          {address.phoneNumber}
        </p>

        <p>
          استان و شهر: {address.province}، {address.city}
        </p>

        <p>کد پستی: {address.postalCode}</p>

        <p className="leading-7 sm:col-span-2">نشانی: {address.address}</p>
      </div>
    </section>
  );
}
