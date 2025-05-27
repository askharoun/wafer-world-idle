
export const formatNumber = (num: number): string => {
  if (num < 1000) {
    return num.toFixed(2);
  } else if (num < 1000000) {
    return (num / 1000).toFixed(2) + 'K';
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num < 1000000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  } else {
    return (num / 1000000000000).toFixed(2) + 'T';
  }
};

export const calculateCost = (baseCost: number, owned: number, multiplier: number = 1.15): number => {
  return baseCost * Math.pow(multiplier, owned);
};

export const calculateProduction = (
  baseProduction: number,
  owned: number,
  level: number,
  marketMultiplier: number = 1
): number => {
  return baseProduction * owned * level * marketMultiplier;
};
