import { Then } from "@cucumber/cucumber";
import { getElementLocator } from "../support/web-element-helper";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../support/wait-for-behavior";
import { ScenarioWorld } from "./setup/world";
import { ElementKey } from "../env/global";
import { getAttributeText, getElements, getElementText, getElementTextAtIndex, getElementValueAtIndex } from "../support/html-behavior";
import { priceOrIdNormalize } from "../support/price-normalize-behavior";

Then(
  /^Я извлекаю текст у элемента "([^"]+)" и сохраняю его как "([^"]+)" в глобальное хранилище$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(`Я извлекаю текст у элемента ${variableKey} и сохраняю его как ${variableKey} в глобальное хранилище`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementText = await getElementText(page, elementIdentifier);
          if (elementText != null) {
            globalStorage[variableKey] = elementText;
            return { result: WaitForResult.PASS };
          } else {
            return {
              result: WaitForResult.FAIL,
              replace: `Не пройдено условие: Я извлекаю текст у элемента ${variableKey} и сохраняю его как ${variableKey} в глобальное хранилище`,
            };
          }
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
  /^Я извлекаю значение атрибута "([^"]+)" у элемента "([^"]+)" и сохраняю его как "([^"]+)" в глобальное хранилище$/,
  async function (this: ScenarioWorld, attribute: string, elementKey: ElementKey, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(
      `Я извлекаю значение атрибута ${attribute} у элемента ${variableKey} и сохраняю его как ${variableKey} в глобальное хранилище`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementText = await getAttributeText(page, elementIdentifier, attribute);
          if (elementText != null) {
            globalStorage[variableKey] = elementText;
            return { result: WaitForResult.PASS };
          } else {
            return {
              result: WaitForResult.FAIL,
              replace: `Не пройдено условие: Я извлекаю значение атрибута ${attribute} у элемента ${variableKey} и сохраняю его как ${variableKey} в глобальное хранилище`,
            };
          }
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
  /^Я извлекаю "(текст|значение)" у "((?:[0-9]+го)|последнего)" элемента "([^"]+)" и сохраняю его как "([^"]+)" в глобальное хранилище$/,
  async function (this: ScenarioWorld, target: string, elementPosition: string, elementKey: ElementKey, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(`Я извлекаю текст у ${elementPosition} элемента ${elementKey} и сохраняю его как ${variableKey} в глобальное хранилище`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последнего"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });
        let elementText;
        if (elementStable) {
          switch (target) {
            case "текст":
              elementText = await getElementTextAtIndex(page, elementIdentifier, index);
              break;
            case "значение":
              elementText = await getElementValueAtIndex(page, elementIdentifier, index);
              break;
          }
          if (elementText != null) {
            globalStorage[variableKey] = elementText;
            return { result: WaitForResult.PASS };
          } else {
            return {
              result: WaitForResult.FAIL,
              replace: `Не пройдено условие: Я извлекаю текст у ${elementPosition} элемента ${elementKey} и сохраняю его как ${variableKey} в глобальное хранилище`,
            };
          }
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
  /^Я сохраняю (цену|идентификатор) элемента "([^"]+)" и сохраняю его как "([^"]+)" в глобальное хранилище$/,
  async function (this: ScenarioWorld, target: string, elementKey: ElementKey, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(`Я сохраняю ${target} элемента ${elementKey} и сохраняю его как ${variableKey} в глобальное хранилище`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const elementText = await getElementText(page, elementIdentifier);
          if (elementText != null) {
            globalStorage[variableKey] = priceOrIdNormalize(elementText) as string;
            return { result: WaitForResult.PASS };
          } else {
            return {
              result: WaitForResult.FAIL,
              replace: `Не пройдено условие: Я сохраняю ${target} элемента ${elementKey} и сохраняю его как ${variableKey} в глобальное хранилище`,
            };
          }
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
  /^Я сохраняю (цену|идентификатор) "((?:[0-9]+го)|последнего)" элемента "([^"]*)" и сохраняю его как "([^"]+)" в глобальное хранилище$/,
  async function (this: ScenarioWorld, target: string, elementPosition: string, elementKey: ElementKey, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(`Я сохраняю ${target} ${elementPosition} элемента ${elementKey} и сохраняю его как ${variableKey} в глобальное хранилище`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последнего"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index, { state: "attached" });

        if (elementStable) {
          const elementText = await getElementTextAtIndex(page, elementIdentifier, index);
          if (elementText != null) {
            globalStorage[variableKey] = priceOrIdNormalize(elementText) as string;
            return { result: WaitForResult.PASS };
          } else {
            return {
              result: WaitForResult.FAIL,
              replace: `Не пройдено условие: Я сохраняю ${target} ${elementPosition} элемента ${elementKey} и сохраняю его как ${variableKey} в глобальное хранилище`,
            };
          }
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
