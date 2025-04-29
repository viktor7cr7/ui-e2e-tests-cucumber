import { ElementHandle, Locator, Page } from "playwright";
import { ElementLocator } from "../env/global";

export const clickElement = async (page: Page, elementIdentifier: ElementLocator): Promise<void> => {
  await page.waitForLoadState('networkidle')
  await page.click(elementIdentifier);
};

export const clickElementAtIndex = async (page: Page, elementIdentifier: ElementLocator, elementPosition: number): Promise<void> => {
  const element = elementPosition === -1 ? page.locator(elementIdentifier).last() : await page.$(`${elementIdentifier}>>nth=${elementPosition}`)
  await element?.click();
};

export const hoverElementAtIndex = async (page: Page, elementIdentifier: ElementLocator, index: number): Promise<void> => {
  const element = await getElementAtIndex(page, elementIdentifier, index);
  await element?.hover();
};

export const getElement = async (page: Page, elementLocator: ElementLocator): Promise<ElementHandle<HTMLElement | SVGElement> | null> => {
  const element = await page.$(elementLocator);
  return element;
};

export const getElements = async (
  page: Page,
  elementLocator: ElementLocator
): Promise<ElementHandle<HTMLElement | SVGElement>[] | null> => {
  const element = await page.$$(elementLocator);
  return element;
};

export const getElementsAttribute = async (page: Page, attributeKey: string) => {
  const elements = await page.$$(attributeKey)
  return elements.length
}

export const getElementAtIndex = async (
  page: Page,
  elementIdentifier: ElementLocator,
  elementPosition: number
): Promise<ElementHandle<HTMLElement | SVGElement> | null> => {
  const element = await page.$(`${elementIdentifier}>>nth=${elementPosition}`);
  return element;
};

export const getElementText = async (page: Page, elementIdentifier: ElementLocator): Promise<string | null> => {
  const elementText = await page.textContent(elementIdentifier);
  return elementText;
};

export const getElementsText = async (page: Page, elementIdentifier: ElementLocator): Promise<string[]> => {
  const elements = await page.$$(elementIdentifier);
  const elementsText = (await Promise.all(elements.map(async (element) => { return await element.textContent()}))) as unknown as string[]
  return elementsText;
};

export const getElementTextAtIndex = async (
  page: Page,
  elementIdentifier: ElementLocator,
  index: number
): Promise<string | null> => {
  const textAtIndex = await page.textContent(`${elementIdentifier}>>nth=${index}`)
  return textAtIndex
}

const checkedMatchText = async (
  elementsCollection: ElementHandle<HTMLElement | SVGElement>[],
  expectedElementText: string
): Promise<boolean> => {
  return !(
    await Promise.all(
      elementsCollection.map(async (element) => !(await element.textContent())?.trim().toLocaleLowerCase().includes(expectedElementText))
    )
  ).some(Boolean);
};

const checkedEqualText = async (
  elementsCollection: ElementHandle<HTMLElement | SVGElement>[],
  expectedElementText: string
): Promise<boolean> => {
  return !(
    await Promise.all(
      elementsCollection.map(async (element) => !((await element.textContent())?.trim().toLocaleLowerCase() === expectedElementText))
    )
  ).some(Boolean);
};

export const elementsToContainText = async (page: Page, elementLocator: ElementLocator, expectedElementText: string): Promise<boolean> => {
  const elementsText = await page.$$(elementLocator);
  return checkedMatchText(elementsText, expectedElementText.toLowerCase());
};

export const inputElementValue = async (page: Page, elementLocator: ElementLocator, inputValue: string): Promise<void> => {
  await page.focus(elementLocator);
  await page.fill(elementLocator, inputValue);
};

export const inputElementValueAtIndex = async (page: Page, elementLocator: ElementLocator, inputValue: string, index: number): Promise<void> => {
  await page.fill(`${elementLocator}>>nth=${index}`, inputValue);
};

export const selectElementValue = async (page: Page, elementIdentifier: ElementLocator, option: string) => {
  await page.focus(elementIdentifier);
  await page.selectOption(elementIdentifier, option);
};

export const selectElementValueAtIndex = async (page: Page, elementIdentifier: ElementLocator, option: string, index: number) => {
  await page.focus(elementIdentifier);
  await page.selectOption(`${elementIdentifier}>>nth=${index}`, option);
};

export const getNumberText = async (elementsCollection: ElementHandle<HTMLElement | SVGElement>[]): Promise<number[]> => {
  return await Promise.all(elementsCollection.map(async (element) => Number((await element.textContent())?.replace(/[^0-9]+/g, ""))));
};

export const getElementValue = async (page: Page, elementIdentifier: ElementLocator): Promise<string | null> => {
  const value = await page.$eval<string, HTMLSelectElement>(elementIdentifier, (element) => {
    return element.value;
  });
  return value;
};

export const getElementValueAtIndex = async (page: Page, elementIdentifier: ElementLocator, elementPosition: number): Promise<string | null> => {
  const value = await page.$eval<string, HTMLSelectElement>(`${elementIdentifier}>>nth=${elementPosition}`, (element) => {
    return element.value;
  });
  return value;
};

export const getAttributeText = async (page: Page, elementIdentifier: ElementLocator, attribute: string): Promise<string | null> => {
  const attributeText = page.locator(elementIdentifier).getAttribute(attribute);
  return attributeText;
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

export const equalElementsText = async (page: Page, elementLocator: ElementLocator, expectedElementText:string) => {
  const elementsText = await page.$$(elementLocator)
  return checkedEqualText(elementsText, expectedElementText.toLowerCase());
}

export const getElementByText = async (page: Page, elementLocator: ElementLocator, text: string) => {
  const element = page.locator(elementLocator).getByText(text, {exact: true})
  return element
}

export const clickElementToLocator = async (elementLocator: Locator) => {
   await elementLocator.click()
}