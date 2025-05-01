import { ElementHandle, Locator, Page } from "playwright";
import { ElementLocator } from "../env/global";
import { checkedEqualText, checkedMatchText } from "./html-helper";
import { locatorToArray } from "./locator-helper";

export const clickElement = async (page: Page, elementIdentifier: ElementLocator): Promise<void> => {
  await page.click(elementIdentifier);
};

export const clickElementAtIndex = async (page: Page, elementIdentifier: ElementLocator, index: number): Promise<void> => {
  const element = await page.locator(elementIdentifier).nth(index);
  await element.click();
};

export const clickElementToLocator = async (elementLocator: Locator) => {
  await elementLocator.click();
};

export const hoverElementAtIndex = async (page: Page, elementIdentifier: ElementLocator, index: number): Promise<void> => {
  const element = await getElementAtIndex(page, elementIdentifier, index);
  await element.hover();
};

export const getElement = async (page: Page, elementLocator: ElementLocator): Promise<Locator> => {
  const element = page.locator(elementLocator);
  return element;
};

export const getElements = async (page: Page, elementLocator: ElementLocator): Promise<Locator> => {
  const element = page.locator(elementLocator);
  return element;
};

export const getElementAtIndex = async (page: Page, elementIdentifier: ElementLocator, elementPosition: number): Promise<Locator> => {
  const element = page.locator(elementIdentifier).nth(elementPosition);
  return element;
};

export const getElementText = async (page: Page, elementIdentifier: ElementLocator): Promise<string | null> => {
  const locator = await page.locator(elementIdentifier);
  return await locator.textContent();
};

export const getElementsText = async (page: Page, elementIdentifier: ElementLocator): Promise<(string | null)[]> => {
  const elements = await locatorToArray(await getElements(page, elementIdentifier));
  return await Promise.all(elements.map(async (element) => element.textContent()));
};

export const getElementTextAtIndex = async (page: Page, elementIdentifier: ElementLocator, index: number): Promise<string> => {
  const locatorAtIndex = page.locator(elementIdentifier).nth(index);
  return (await locatorAtIndex.textContent()) as string;
};

export const getElementByText = async (page: Page, elementLocator: ElementLocator, text: string) => {
  const element = page.locator(elementLocator).getByText(text, { exact: true });
  return element;
};

export const getElementValue = async (page: Page, elementIdentifier: ElementLocator): Promise<string> => {
  return (await page.locator(elementIdentifier).inputValue()) as string;
};

export const getElementValueAtIndex = async (page: Page, elementIdentifier: ElementLocator, index: number): Promise<string> => {
  return await page.locator(elementIdentifier).nth(index).inputValue();
};

export const getLengthElements = async (page: Page, selector: string) => {
  const elementsLenght = await page.locator(selector).count();
  return elementsLenght;
};

export const getAttributeText = async (page: Page, elementIdentifier: ElementLocator, attribute: string): Promise<string | null> => {
  const attributeText = page.locator(elementIdentifier).getAttribute(attribute);
  return attributeText;
};

export const inputElementValue = async (page: Page, elementLocator: ElementLocator, inputValue: string): Promise<void> => {
  await page.focus(elementLocator);
  await page.fill(elementLocator, inputValue);
};

export const inputElementValueAtIndex = async (
  page: Page,
  elementLocator: ElementLocator,
  inputValue: string,
  index: number
): Promise<void> => {
  await page.locator(elementLocator).nth(index).fill(inputValue);
};

export const selectElementValue = async (page: Page, elementIdentifier: ElementLocator, option: string) => {
  await page.locator(elementIdentifier).selectOption(option);
};

export const selectElementValueAtIndex = async (page: Page, elementIdentifier: ElementLocator, option: string, index: number) => {
  await page.locator(elementIdentifier).nth(index).selectOption(option);
};

export const equalElementsText = async (page: Page, elementLocator: ElementLocator, expectedElementText: string) => {
  const elementsLocator = page.locator(elementLocator);
  return checkedEqualText(elementsLocator, expectedElementText.toLowerCase());
};

export const elementsToContainText = async (page: Page, elementLocator: ElementLocator, expectedElementText: string): Promise<boolean> => {
  const elementsLocator = page.locator(elementLocator);
  return checkedMatchText(elementsLocator, expectedElementText.toLowerCase());
};