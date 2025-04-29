import { Then, When } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { ScenarioWorld } from "./setup/world";
import { getElementLocator } from "../support/web-element-helper";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../support/wait-for-behavior";
import {
  clickElement,
  clickElementAtIndex,
  clickElementToLocator,
  getElementAtIndex,
  getElementByText,
  getElements,
  hoverElementAtIndex,
} from "../support/html-behavior";

Then(/^Я нажимаю (кнопку|ссылку) "([^"]+)"$/, async function (this: ScenarioWorld, target: string, elementKey: ElementKey) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  console.log(`Я нажимаю ${target} ${elementKey} `);

  const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

  await waitFor(
    async () => {
      const result = await waitForSelector(page, elementIdentifier);
      if (result) {
        await clickElement(page, elementIdentifier);
        return WaitForResult.PASS;
      }
      return WaitForResult.ELEMENT_NOT_AVAILABLE;
    },
    globalConfig,
    {
      failureMessage: `Элемент ${elementIdentifier} не находится в состоянии visible, проверьте состояние элемента в DOM`,
      target: elementKey,
    }
  );
});

Then(
  /^Я ищу элемент "([^"]+)" по тексту из глобального хранилища "([^"]+)" и кликаю на него$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(`Я ищу элемент ${elementKey} по тексту из глобального хранилища ${variableKey} и кликаю на него`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier);

        if (elementStable) {
          const variableValue = globalStorage[variableKey];
          const element = await getElementByText(page, elementIdentifier, variableValue);
          await clickElementToLocator(element);
          return WaitForResult.PASS;
        }
        return WaitForResult.FAIL;
      },
      globalConfig,
      {
        failureMessage: `Элемент ${elementIdentifier} не находится в состоянии visible, проверьте состояние элемента в DOM`,
        target: elementKey,
      }
    );
  }
);

When(
  /^Я нажимаю на "((:?[0-9]+ую|[0-9]+ю|последнюю))" (кнопку|ссылку) "([^"]+)"$/,
  async function (this: ScenarioWorld, elementPosition: string, target: string, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Я нажимаю на ${elementPosition} ${target} ${elementKey}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последнюю"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index);

        if (elementStable) {
          await clickElementAtIndex(page, elementIdentifier, index);
          return WaitForResult.PASS;
        }

        return WaitForResult.FAIL;
      },
      globalConfig,
      {
        failureMessage: `Элемент ${elementIdentifier} не находится в состоянии visible, проверьте состояние элемента в DOM`,
        target: elementKey,
      }
    );
  }
);

Then(
  /^Я навожу мышкой на "([0-9]+)(?:ой|ый|ий)" элемент "([^"]+)"$/,
  async function (this: ScenarioWorld, elementPosition: string, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Я навожу мышкой на ${elementPosition} элемент ${elementKey}`);

    const index = Number(elementPosition.replace(/\D/g, "")) - 1;

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index);
        if (elementStable) {
          await hoverElementAtIndex(page, elementIdentifier, index);
          return WaitForResult.PASS;
        }
        return WaitForResult.FAIL;
      },
      globalConfig,
      {
        failureMessage: `Элемент ${elementIdentifier} не находится в состоянии visible, проверьте состояние элемента в DOM`,
        target: elementKey,
      }
    );
  }
);
