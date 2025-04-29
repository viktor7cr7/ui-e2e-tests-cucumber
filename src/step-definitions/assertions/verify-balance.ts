import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { waitFor, WaitForResult, waitForSelector } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { getElementText } from "../../support/html-behavior";
import { normalizeTwoСommas, priceOrIdNormalize } from "../../support/price-normalize-behavior";

Then(
  /^Баланс пользователя "([^"]*)" уменьшился на цену "([^"]*)" в глобальном хранилище для значения "([^"]*)"$/,
  async function (this: ScenarioWorld, elementKey: string, decreasePrice: string, variableKey: string) {
    const {
      screen: { page },
      globalStorage,
      globalConfig,
    } = this;

    console.log(`Баланс пользователя ${elementKey} уменьшился на цену ${decreasePrice} в глобальном хранилище для значения ${variableKey}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

        if (elementStable) {
          const oldBalance = globalStorage[variableKey].replace(/,/g, "");
          const newBalance = priceOrIdNormalize((await getElementText(page, elementIdentifier)) as string)?.replace(/,/g, "");
          const [price] = normalizeTwoСommas([globalStorage[decreasePrice]]);

          const result = Number(oldBalance) - Number(newBalance) === Number(price);
          if (result) {
            return {
              result: WaitForResult.PASS,
            };
          } else {
            return {
              result: WaitForResult.FAIL,
              replace: "Баланс пользователя не уменьшился на ожидаемую цену, проверьте сравниваемые значения",
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
