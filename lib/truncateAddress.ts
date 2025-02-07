export const truncateAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 14)}...${address.slice(-12)}`;
};
