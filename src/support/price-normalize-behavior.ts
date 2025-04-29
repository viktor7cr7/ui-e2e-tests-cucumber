export const priceOrIdNormalize = (price: string): string | null => {
  if (price.includes("$")) {
    return price.replace(/[^\d,.]+/g, "").split(/(\.|,)+/)[0];
  } else {
    return price.match(/\d+/g)?.join(",") as string;
  }
};

export function normalizeTwoСommas(prices: string[]) {
  return prices.map((price) => {
    if (price.match(/,/g)?.length === 2) {
      console.log("123");
      return price.split(",").slice(0, -1).join("").replace(",", "");
    } else {
      return price.replace(",", "");
    }
  });
}

export const priceAssert = (firstPrice: string, secondPrice: string) => {
  const [firstNormalizePrice, secondNormalizePrice] = normalizeTwoСommas([firstPrice, secondPrice]);
  return firstNormalizePrice === secondNormalizePrice;
};

export const discountCalculation = (oldPrice: string, percentage: string) => {
  const resultCalculate = +oldPrice - (+oldPrice * +percentage) / 100;
  return resultCalculate;
};
