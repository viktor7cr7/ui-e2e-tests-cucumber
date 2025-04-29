import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import { getElementLocator } from "../support/web-element-helper";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../support/wait-for-behavior";
import {
  changeElementDirection,
  getAttributeText,
  getElements,
  inputElementValue,
  inputElementValueAtIndex,
  selectElementValue,
  selectElementValueAtIndex,
} from "../support/html-behavior";
import { ElementKey, ElementLocator } from "../env/global";
import { uploadFile } from "../support/action";

Then(
  /^Я заполняю поле "([^"]+)" значением "([^"]+)"( из глобального хранилища)?$/,
  async function (this: ScenarioWorld, elementKey: ElementLocator, inputText: string, isGlobalStorage: boolean) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;
    console.log(`Я заполняю поле ${elementKey} значением ${inputText} ${isGlobalStorage ? "из глобального хранилища" : ""}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const result = await waitForSelector(page, elementIdentifier);

        if (result && isGlobalStorage) {
          const valueGlobalStorage = globalStorage[inputText];
          await inputElementValue(page, elementIdentifier, valueGlobalStorage);
          return WaitForResult.PASS;
        } else if (result) {
          await inputElementValue(page, elementIdentifier, inputText);
          return WaitForResult.PASS;
        }
        return WaitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      { failureMessage: `Элемент ${elementIdentifier} недоступен для ввода, проверьте состояние элемента`, target: elementKey }
    );
  }
);

Then(
  /^Я заполняю "([0-9]+)(?:ое|е)" поле "([^"]+)" значением "([^"]+)"( из глобального хранилища)?$/,
  async function (this: ScenarioWorld, elementPosition: string, elementKey: ElementLocator, inputText: string, isGlobalStorage) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;
    console.log(
      `Я заполняю ${elementPosition} поле ${elementKey} значением ${inputText} ${isGlobalStorage ? "из глобального хранилища" : ""}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      elementPosition === "последнего"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const result = await waitForSelectorAtIndex(page, elementIdentifier, index);

        if (result && isGlobalStorage) {
          const valueGlobalStorage = globalStorage[inputText];
          await inputElementValueAtIndex(page, elementIdentifier, valueGlobalStorage, index);
          return WaitForResult.PASS;
        } else if (result) {
          console.log("else if");
          await inputElementValueAtIndex(page, elementIdentifier, inputText, index);
          return WaitForResult.PASS;
        }
        return WaitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        failureMessage: `${elementPosition} элемент ${elementIdentifier} недоступен для ввода, проверьте состояние элемента`,
        target: elementKey,
      }
    );
  }
);

Then(
  /^Я выбираю значение "([^"]+)" из ([0-9]+го )?селекта "([^"]+)"$/,
  async function (this: ScenarioWorld, option: string, elementPosition: string, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Я выбираю значение ${option} из ${elementPosition ? elementPosition : ""} селекта ${elementKey}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index = elementPosition ? Number(elementPosition.replace(/\D/g, "")) - 1 : 0;

    await waitFor(
      async () => {
        const stableElement = await waitForSelectorAtIndex(page, elementIdentifier, index);

        if (stableElement && index) {
          await selectElementValueAtIndex(page, elementIdentifier, option, index);
          return WaitForResult.PASS;
        } else if (stableElement) {
          await selectElementValue(page, elementIdentifier, option);
          return WaitForResult.PASS;
        } else {
          return WaitForResult.FAIL;
        }
      },
      globalConfig,
      { failureMessage: `Элемент ${elementIdentifier} недоступен для выбора, проверьте состояние элемента`, target: elementKey }
    );
  }
);

Then(
  /^Я загружаю файл "(.+\.(?:jpeg|jpg|png|img))" в элемент "([^"]+)"$/,
  async function (this: ScenarioWorld, fileName: string, elementKey: ElementLocator) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Я загружаю файл ${fileName} в элемент ${elementKey}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier);

        if (elementStable) {
          await uploadFile(page, elementIdentifier, fileName);
          return WaitForResult.PASS;
        }
        return WaitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      { failureMessage: `Элемент ${elementIdentifier} недоступен для загрузки файла, проверьте состояние элемента`, target: elementKey }
    );
  }
);

Then(
  /^Текст атрибута "([^"]+)" в элементе "([^"]+)" (не )?должен быть равен тексту "(.+)"$/,
  async function (this: ScenarioWorld, attribute: string, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Текст атрибута ${attribute} в элементе ${elementKey} ${negate ? "не " : ""} должен бывать равен тексту ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const stableElement = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (stableElement) {
          const attributeText = await getAttributeText(page, elementIdentifier, attribute);
          return (attributeText === expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Текст атрибута ${attribute} в элементе ${elementKey} ${
                  negate ? "не " : ""
                } должен бывать равен тексту ${expectedText}`,
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
  /^Текст атрибута "([^"]+)" в элементе "([^"]+)" (не )?должен содержать текст "(.+)"$/,
  async function (this: ScenarioWorld, attribute: string, elementKey: ElementKey, negate: boolean, expectedText: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Текст атрибута ${attribute} в элементе ${elementKey} ${negate ? "не " : ""} должен содержать текст ${expectedText}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const stableElement = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (stableElement) {
          const attributeText = await getAttributeText(page, elementIdentifier, attribute);
          return attributeText?.includes(expectedText) === !negate
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Текст атрибута ${attribute} в элементе ${elementKey} ${
                  negate ? "не " : ""
                } должен содержать текст ${expectedText}`,
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
  /^Элемент "([^"]+)" внутри "([^"]+)" передвигаю на "(\d+)%" (вправо|влево)$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, container: ElementLocator, percentage: string, direction: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Элемент "${elementKey} внутри ${container} передвигаю на ${percentage} ${direction}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);
    const elementIdentifierContainer = getElementLocator(page, container, globalConfig);

    await waitFor(async () => {
      const stableElement = await waitForSelector(page, elementIdentifier);
      const stableElementContainer = await waitForSelector(page, elementIdentifierContainer);
      if (stableElement && stableElementContainer) {
        await changeElementDirection(page, elementIdentifier, elementIdentifierContainer, percentage, direction);
        return WaitForResult.PASS;
      }
      return WaitForResult.ELEMENT_NOT_AVAILABLE;
    }, globalConfig, {failureMessage: `Элемент ${elementIdentifier} и/или ${elementIdentifierContainer} не находятся в состоянии visible, проверьте состояние элементов в DOM`});
  }
);
