import { Then } from "@cucumber/cucumber";
import { ElementLocator } from "../../env/global";
import { ScenarioWorld } from "../setup/world";
import { waitFor, WaitForResult, waitForSelector } from "../../support/wait-for-behavior";
import { getElementsAttribute } from "../../support/html-behavior";
import { getElementLocator } from "../../support/web-element-helper";

Then(
  /^На странице долж(?:ны|ен) быть только "([0-9]+)" элемент(?:а|ов) со значением селектора "([^"]+)"$/,
  async function (this: ScenarioWorld, count: string, attributeKey: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`На странице должно быть только ${count} элемента со значением селектора ${attributeKey}`);

    const elementIdentifier = getElementLocator(page, attributeKey, globalConfig);

    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

      if (elementStable) {
        const countAttributePage = await getElementsAttribute(page, elementIdentifier);
        return countAttributePage === +count
          ? { result: WaitForResult.PASS }
          : {
              result: WaitForResult.FAIL,
              replace: `Не выполнено условие: На странице должно быть только ${count} элемента со значением селектора ${attributeKey}`,
            };
      }
      return {
        result: WaitForResult.ELEMENT_NOT_AVAILABLE,
        replace: `Элементы ${elementIdentifier} не доступны, проверьте доступность элемента в DOM`,
      };
    },
    globalConfig,
    { target: attributeKey }
  );
  }
);
