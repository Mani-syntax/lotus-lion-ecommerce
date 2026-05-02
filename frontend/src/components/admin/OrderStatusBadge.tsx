'use client';

interface OrderStatusBadgeProps {
  isPaid: boolean;
  isDelivered: boolean;
  status?: string;
}

export default function OrderStatusBadge({ isPaid, isDelivered, status }: OrderStatusBadgeProps) {
  let label = 'Pending';
  let classes = 'bg-yellow-500/10 text-yellow-500';

  if (isDelivered) {
    label = 'Delivered';
    classes = 'bg-green-500/10 text-green-500';
  } else if (status === 'shipped') {
    label = 'Shipped';
    classes = 'bg-blue-500/10 text-blue-500';
  } else if (isPaid) {
    label = 'Paid';
    classes = 'bg-emerald-500/10 text-emerald-500';
  }

  return (
    <span className={`text-[8px] px-2 py-1 rounded-full uppercase font-bold tracking-widest ${classes}`}>
      {label}
    </span>
  );
}
