import { Then } from "@cucumber/cucumber";
import { ElementKey } from "../../env/global";
import { ScenarioWorld } from "../setup/world";
import { getElementLocator } from "../../support/web-element-helper";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../../support/wait-for-behavior";
import { getAttributeText, getElements, getElementText, getElementTextAtIndex } from "../../support/html-behavior";
import { priceAssert, priceOrIdNormalize } from "../../support/price-normalize-behavior";
import { dateNormalize } from "../../support/date-normalize-behavior";

Then(
  /^(Текст|Значение(?: атрибута)?)(?: "(?![0-9]+го)([^"]+)")? элемента "([^"]+)" (не )?должен быть равен тексту в глобальном хранилище для значения "([^"]+)"$/,
  async function (this: ScenarioWorld, target: string, attribute: string, elementKey: ElementKey, negate: boolean, storageKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(
      `${target} ${attribute ? attribute : ""} элемента ${elementKey} ${
        negate ? "не " : ""
      }должен быть равен тексту в глобальном хранилище для значения ${storageKey}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });
        const variableValue = globalStorage[storageKey];
        if (elementStable) {
          let elementText: string | null;
          switch (target) {
            case "Текст":
              elementText = await getElementText(page, elementIdentifier);
              return (variableValue.trim() === elementText?.trim()) === !negate
                ? { result: WaitForResult.PASS }
                : {
                    result: WaitForResult.FAIL,
                    replace: `Не пройдено условие: ${target} ${attribute ? attribute : ""} элемента ${elementKey} ${
                      negate ? "не " : ""
                    }должен быть равен тексту в глобальном хранилище для значения ${storageKey}`,
                  };
            case "Значение":
              elementText = await getAttributeText(page, elementIdentifier, attribute);
              return (variableValue.trim() === elementText?.trim()) === !negate
                ? { result: WaitForResult.PASS }
                : {
                    result: WaitForResult.FAIL,
                    replace: `Не пройдено условие: ${target} ${attribute ? attribute : ""} элемента ${elementKey} ${
                      negate ? "не " : ""
                    }должен быть равен тексту в глобальном хранилище для значения ${storageKey}`,
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
  /^Текст "([0-9]+го|последнего)" элемента "([^"]+)" (не )?должен быть равен тексту в глобальном хранилище для значения "([^"]+)"$/,
  async function (this: ScenarioWorld, elementPosition: string, elementKey: ElementKey, negate: boolean, storageKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(
      `Текст элемента ${elementKey} ${negate ? "не " : ""}должен быть равен тексту в глобальном хранилище для значения ${storageKey}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последнего"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index, { state: "attached" });

        const variableValue = globalStorage[storageKey];

        if (elementStable) {
          const elementText = await getElementTextAtIndex(page, elementIdentifier, index);
          return (variableValue === elementText) == !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Текст элемента ${elementKey} ${
                  negate ? "не " : ""
                }должен быть равен тексту в глобальном хранилище для значения ${storageKey}`,
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
  /^Цена элемента "([^"]+)" (не )?должна быть равна цене в глобальном хранилище для значения "([^"]+)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, storageKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(
      `Цена элемента ${elementKey} ${negate ? "не " : ""}должна быть равна цене в глобальном хранилище для значения ${storageKey}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        const variableValue = globalStorage[storageKey];

        if (elementStable) {
          const elementText = (await getElementText(page, elementIdentifier)) as string;
          const price = priceOrIdNormalize(elementText) as string;
          return priceAssert(variableValue, price) == !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Цена элемента ${elementKey} ${
                  negate ? "не " : ""
                }должна быть равна цене в глобальном хранилище для значения ${storageKey}`,
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
  /^Количество элемента "([^"]+)" (не )?должно быть равно количеству в глобальном хранилище для значения "([^"]*)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean, storageKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(
      `Количество элемента ${elementKey} ${
        negate ? "не " : ""
      }должно быть равно количеству в глобальном хранилище для значения ${storageKey}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        const variableValue = globalStorage[storageKey];

        if (elementStable) {
          const elementText = (await getElementText(page, elementIdentifier)) as string;
          const quantity = dateNormalize(elementText) as string;
          return (variableValue === quantity) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Количество элемента ${elementKey} ${
                  negate ? "не " : ""
                }должно быть равно количеству в глобальном хранилище для значения ${storageKey}`,
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
  /^Цена "((?:[0-9]+го)|последнего)" элемента "([^"]+)" (не )?должна быть равна цене в глобальном хранилище для значения "([^"]+)"$/,
  async function (this: ScenarioWorld, elementPosition: string, elementKey: ElementKey, negate: boolean, storageKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(
      `Цена ${elementPosition} элемента ${elementKey} ${
        negate ? "не " : ""
      }должна быть равна цене в глобальном хранилище для значения ${storageKey}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последнего"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index, { state: "attached" });

        const variableValue = globalStorage[storageKey];

        if (elementStable) {
          const elementText = (await getElementTextAtIndex(page, elementIdentifier, index)) as string;

          const price = priceOrIdNormalize(elementText) as string;
          return priceAssert(variableValue, price) == !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Цена ${elementPosition} элемента ${elementKey} ${
                  negate ? "не " : ""
                }должна быть равна цене в глобальном хранилище для значения ${storageKey}`,
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
