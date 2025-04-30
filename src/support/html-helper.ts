import { ElementHandle, Page } from "playwright";
import { ElementLocator } from "../env/global";

export const checkedMatchText = async (
  elementsCollection: ElementHandle<HTMLElement | SVGElement>[],
  expectedElementText: string
): Promise<boolean> => {
  return !(
    await Promise.all(
      elementsCollection.map(async (element) => !(await element.textContent())?.trim().toLocaleLowerCase().includes(expectedElementText))
    )
  ).some(Boolean);
};

export const checkedEqualText = async (
  elementsCollection: ElementHandle<HTMLElement | SVGElement>[],
  expectedElementText: string
): Promise<boolean> => {
  return !(
    await Promise.all(
      elementsCollection.map(async (element) => !((await element.textContent())?.trim().toLocaleLowerCase() === expectedElementText))
    )
  ).some(Boolean);
};

export const getNumberText = async (elementsCollection: ElementHandle<HTMLElement | SVGElement>[]): Promise<number[]> => {
  return await Promise.all(elementsCollection.map(async (element) => Number((await element.textContent())?.replace(/[^0-9]+/g, ""))));
};

export const changeElementDirection = async (
  page: Page,
  elementIdentifier: ElementLocator,
  container: ElementLocator,
  percentage: string,
  direction: string
) => {
  const elementTarget = page.locator(elementIdentifier);
  const elementContainer = page.locator(container);

  const elementBox = await elementTarget.boundingBox();
  const containerBox = await elementContainer.boundingBox();

  if (elementBox && containerBox) {
    const moveBy = (parseInt(percentage) / 100) * containerBox.width;
    const offsetX = direction === "вправо" ? moveBy : -moveBy;

    await page.mouse.move(elementBox.x + elementBox.width / 2, elementBox.y + elementBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(elementBox.x + elementBox.width / 2 + offsetX, elementBox.y + elementBox.height / 2);
    await page.mouse.up();
  } else {
    throw new Error(`Элемент "${elementIdentifier} или ${container}" не найден или скрыт.`);
  }
};
