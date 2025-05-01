import { Page } from "playwright";
import { ElementLocator } from "../env/global";

export const getElementFromTable = async (page: Page, tableLocator: ElementLocator, elementKey: ElementLocator, index: number) => {
  return page.locator(tableLocator).locator(elementKey).nth(index).textContent();
};
