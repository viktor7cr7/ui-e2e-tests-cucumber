import { Then } from "@cucumber/cucumber";
import { ElementKey } from "../../env/global";
import { ScenarioWorld } from "../setup/world";
import { getElementLocator } from "../../support/web-element-helper";
import { waitFor, WaitForResult, waitForSelector } from "../../support/wait-for-behavior";
import { getElementText } from "../../support/html-behavior";
import { normalizeTwoСommas, priceOrIdNormalize } from "../../support/price-normalize-behavior";

Then(
  /^Цена элемента в "usd" элемента "([^"]+)" должна быть равна цене в глобальном хранилище "([^"]+)"$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, variableKey: string) {
    const {
      screen: { page },
      globalConfig,
      globalStorage,
    } = this;

    console.log(`Цена элемента в "usd" элемента ${elementKey} должна быть равна цене в глобальном хранилище ${variableKey}`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementIdentifier);

        if (elementStable) {
          const priceStorage = globalStorage[variableKey];
          const elementText = (await getElementText(page, elementIdentifier)) as string;
          const clearPriceUSD = priceOrIdNormalize(elementText) as string;

          const [normalizePriceRUB] = normalizeTwoСommas([priceStorage]);

          const convertRUBtoUSD = Math.trunc(Number(normalizePriceRUB) / 87.9) === +clearPriceUSD;
          return convertRUBtoUSD
            ? { result: WaitForResult.PASS }
            : {
                result: WaitForResult.FAIL,
                replace: `Не пройдено условие: Цена элемента в "usd" элемента ${elementKey} должна быть равна цене в глобальном хранилище ${variableKey}`,
              };
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элемент ${elementIdentifier} не находится в состоянии visible, проверьте состояние элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);
