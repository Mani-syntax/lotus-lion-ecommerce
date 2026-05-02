export const formatINR = (amount: number | null | undefined) => {
  const safeAmount = Number(amount || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(safeAmount);
};
