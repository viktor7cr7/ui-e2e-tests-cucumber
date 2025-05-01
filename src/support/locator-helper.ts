import { Locator } from "playwright";

export const locatorToArray = async (locator: Locator): Promise<Locator[]> => {
  const count = await locator.count();
  const elements: Locator[] = [];

  for (let i = 0; i < count; i++) {
    elements.push(locator.nth(i));
  }

  return elements;
};
