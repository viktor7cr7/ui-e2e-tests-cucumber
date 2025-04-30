import { Page } from "playwright";
import { ElementLocator } from "../env/global";

export const getElementFromTable = async (
  page: Page,
  tableLocator: ElementLocator,
  elementKey: ElementLocator,
  elementPosition: number
) => {
  const elementTable = await (await (await page.$(tableLocator))?.$(`${elementKey}>>nth=${elementPosition}`))?.textContent();
  return elementTable;
};
