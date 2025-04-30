import { Then, When } from "@cucumber/cucumber";
import { ElementKey, ElementLocator } from "../../env/global";
import { ScenarioWorld } from "../setup/world";
import { getElementLocator } from "../../support/web-element-helper";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../../support/wait-for-behavior";
import {
  elementsToContainText,
  equalElementsText,
  getAttributeText,
  getElements,
  getElementsText,
  getElementTextAtIndex,
  getElementValue,
} from "../../support/html-behavior";
import { sortNumberElements, sortTextElements } from "../../support/sort-elements-behavior";
import { discountCalculation, normalizeTwoСommas, priceOrIdNormalize } from "../../support/price-normalize-behavior";

When(
  /^Элемент "([^"]+)"( не)? должен содержать текст "([^"]+)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Элемент ${elementKey} ${negate ? "не " : ""}должен содержать текст ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const result = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (result) {
          const elementText = await page.textContent(elementIdentifier);
          return elementText?.includes(expectedText) === !negate ? WaitForResult.PASS : WaitForResult.FAIL;
        }

        return WaitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      { failureMessage: `Не пройдено условие: Элемент ${elementKey} ${negate ? "не " : ""}должен содержать текст ${expectedText}` }
    );
  }
);

Then(
  /^"([0-9]+)" элемент(?:ов|а) "([^"]+)" (не )?долж(?:ны|ен) содержать текст "(.*)"$/,
  async function (this: ScenarioWorld, elementPosition: string, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`${elementPosition} ${elementKey} ${negate ? "не " : ""}должны содержать текст ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const stableElement = (await getElements(page, elementIdentifier)) !== null;

        if (stableElement) {
          const result = await elementsToContainText(page, elementIdentifier, expectedText);
          return result === !negate ? WaitForResult.PASS : WaitForResult.FAIL;
        }
        return WaitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        failureMessage: `${elementPosition} ${elementKey} ${negate ? "не " : ""}должны содержать текст ${expectedText}`,
        target: elementKey,
      }
    );
  }
);

When(
  /^Текст элемента "([^"]+)" (не )?должен содержать текст из значения "([^"]+)" глобального хранилища$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(
      `Текст элемента ${elementKey} ${negate ? "не " : ""}должен содержать текст из значения ${variableKey} глобального хранилища`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const result = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (result) {
          const valueGlobalStorage = globalStorage[variableKey];
          const elementText = await page.textContent(elementIdentifier);
          return elementText?.includes(valueGlobalStorage) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Текст элемента ${elementKey} ${
                  negate ? "не " : ""
                }содержит текст из ${valueGlobalStorage}. Ожидаемый текст - ${elementText}, Текст из хранилища ${valueGlobalStorage}`,
              };
        }

        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

When(
  /^Текст элемента "([^"]+)"( не)? должен быть равен тексту "(.+)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Текст элемента ${elementKey} ${negate ? "не " : ""}должен быть равен тексту ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const result = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (result) {
          const elementText = await page.textContent(elementIdentifier);
          return (elementText === expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие. Ожидаемый текст ${expectedText}. Фактический текст ${elementText}. Negate = ${negate}`,
              };
        }

        return { result: WaitForResult.ELEMENT_NOT_AVAILABLE };
      },
      globalConfig,
      { failureMessage: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`, target: elementKey }
    );
  }
);

Then(
  /^"((?:[0-9]+(?:ый|ой|ий)|последний))" элемент "([^"]+)" (не )?должен содержать текст "(.+)"$/,
  async function (this: ScenarioWorld, elementPosition: string, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`${elementPosition} элемент ${elementKey} ${negate ? "не" : ""} должен содержать текст ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последний"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const stableElement = await waitForSelectorAtIndex(page, elementIdentifier, index, { state: "attached" });

        if (stableElement) {
          const result = (await getElementTextAtIndex(page, elementIdentifier, index)) as string;
          return result.includes(expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: ${elementPosition} элемент ${elementKey} ${
                  negate ? "не" : ""
                } должен содержать текст ${expectedText}. Ожидаемый текст ${expectedText}. Фактический текст ${result}. Negate = ${negate}`,
              };
        }
        return { result: WaitForResult.ELEMENT_NOT_AVAILABLE };
      },
      globalConfig,
      { failureMessage: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`, target: elementKey }
    );
  }
);

Then(
  /^Каждый элемент "([^"]+)" (не )?должен быть равен тексту "(.+)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Каждый элемент ${elementKey} ${negate ? "не " : ""} должен быть равен тексту ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const stableElement = (await page.$$(elementIdentifier)) !== null;

        if (stableElement) {
          const result = await equalElementsText(page, elementIdentifier, expectedText);
          return result === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Каждый элемент ${elementKey} ${
                  negate ? "не " : ""
                } должен быть равен тексту ${expectedText}.`,
              };
        }
        return { result: WaitForResult.ELEMENT_NOT_AVAILABLE, replace: `Элемент ${elementIdentifier} не найден в DOM` };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^Элемент "([^"]+)" должен быть (не )?равен значению "(.+)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`${elementKey} должен быть ${negate ? "не " : ""}равен значению ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementAttribute = await getElementValue(page, elementIdentifier);
          return (elementAttribute === expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: ${elementKey} должен быть ${
                  negate ? "не " : ""
                }равен значению ${expectedText}. Ожидаемый текст - ${expectedText}. Фактический текст - ${elementAttribute}. Negate = ${negate}`,
              };
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^Значение элемента "([^"]+)" (не )?должно быть равно тексту "(.+)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Значение элемента ${elementKey} ${negate ? "не " : ""}должно быть равно тексту ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementAttribute = await getElementValue(page, elementIdentifier);
          return (elementAttribute === expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Значение элемента ${elementKey} ${
                  negate ? "не " : ""
                }должно быть равно тексту ${expectedText}`,
              };
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^Значение элемента "([^"]+)" (не )?должно содержать текст "(.*)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Значение элемента ${elementKey} ${negate ? "не " : ""}должно содержать текст ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementAttribute = await getElementValue(page, elementIdentifier);
          return elementAttribute?.includes(expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Значение элемента ${elementKey} ${
                  negate ? "не " : ""
                }должно содержать текст ${expectedText}. Ожидаемый текст - ${expectedText}. Фактический текст - ${elementAttribute}. Negate = ${negate}`,
              };
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^Значение атрибута "([^"]+)" в элементе "([^"]+)" (не )?должно содержать текст "(.+)"$/,
  async function (this: ScenarioWorld, attribute: string, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Значение  атрибута ${attribute} в элементе ${elementKey} ${negate ? "не " : ""}должно содержать текст ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementAttribute = await getAttributeText(page, elementIdentifier, attribute);
          return elementAttribute?.includes(expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Значение  атрибута ${attribute} в элементе ${elementKey} ${
                  negate ? "не " : ""
                }должно содержать текст ${expectedText}. Ожидаемый текст - ${expectedText}. Фактический текст - ${elementAttribute}. Negate = ${negate}`,
              };
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^Значение атрибута "([^"]+)" в элементе "([^"]+)" (не )?должно быть равно тексту "(.+)"$/,
  async function (this: ScenarioWorld, attribute: string, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Значение  атрибута ${attribute} в элементе ${elementKey} ${negate ? "не " : ""} должно быть равно тексту ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementAttribute = await getAttributeText(page, elementIdentifier, attribute);
          return (elementAttribute === expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Значение  атрибута ${attribute} в элементе ${elementKey} ${
                  negate ? "не " : ""
                } должно быть равно тексту ${expectedText}. Ожидаемый текст - ${expectedText}. Фактический текст - ${elementAttribute}. Negate = ${negate}`,
              };
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^Элементы "(string|number)" "([^"]+)" отсортированы по (убыванию|возрастанию)$/,
  async function (this: ScenarioWorld, typeSort: "string" | "number", elementKey, sortOption) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Элементы ${typeSort} ${elementKey} отсортированы по ${sortOption}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementsStable = (await getElements(page, elementIdentifier)) !== null;

        if (elementsStable) {
          let resultSort: boolean;
          switch (typeSort) {
            case "number":
              resultSort = await sortNumberElements(page, elementIdentifier, sortOption);
              break;
            case "string":
              const textElements = await getElementsText(page, elementIdentifier);
              resultSort = await sortTextElements(textElements, sortOption);
              break;
          }
          return resultSort
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Элементы ${typeSort} ${elementKey} отсортированы по ${sortOption}`,
              };
        }
        return { result: WaitForResult.ELEMENT_NOT_AVAILABLE, replace: `Элементы ${elementKey} не найдены в DOM` };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^Цена "((?:[0-9]+го)|последнего)" элемента "([^"]+)" должна быть рассчитана с учетом сохраненной цены "([^"]+)" в глобальном хранилище к скидке "([0-9]+)(?:%)"$/,
  async function (this: ScenarioWorld, elementPosition: string, elementKey: ElementLocator, savePrice: string, percentage: string) {
    const {
      screen: { page },
      globalStorage,
      globalConfig,
    } = this;

    console.log(
      `Цена ${elementPosition} элемента ${elementKey} должна быть рассчитана с учетом сохраненной цены ${savePrice} в глобальном хранилище к скидке ${percentage}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последнего"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index, { state: "attached" });

        if (elementStable) {
          const [oldPrice] = normalizeTwoСommas([globalStorage[savePrice]]);
          const elementPrice = priceOrIdNormalize((await getElementTextAtIndex(page, elementIdentifier, index)) as string);
          const [normalizePrice] = normalizeTwoСommas([elementPrice as string]);

          const discountСalculationResult = discountCalculation(oldPrice, percentage);
          return discountСalculationResult === +normalizePrice
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не выполнено условие: Цена ${elementPosition} элемента ${elementKey} должна быть рассчитана с учетом сохраненной цены ${savePrice} в глобальном хранилище к скидке ${percentage}. Проверьте входящие данные`,
              };
        }

        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);
