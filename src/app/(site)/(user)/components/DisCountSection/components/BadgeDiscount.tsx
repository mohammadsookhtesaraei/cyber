type BadgeDiscountProps = {
  discount: number;
};

const BadgeDiscount = ({ discount }: BadgeDiscountProps) => {
  return (
    <div className="rounded-lg bg-rose-500 px-4 py-1 text-white">
      {discount}%
    </div>
  );
};
export default BadgeDiscount;
