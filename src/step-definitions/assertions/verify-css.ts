import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { waitFor, WaitForResult, waitForSelector } from "../../support/wait-for-behavior";
import { getElementsAttribute } from "../../support/html-behavior";
import { getElementLocator } from "../../support/web-element-helper";

Then(
  /^На странице долж(?:ны|ен) быть только "([0-9]+)" элемент(?:а|ов) с атрибутом "([^"]+)"$/,
  async function (this: ScenarioWorld, count: string, attributeKey: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`На странице должно быть только ${count} элемента с атрибутом ${attributeKey}`);

    const elementIdentifier = getElementLocator(page, attributeKey, globalConfig);

    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier, {state:'attached'});

      if (elementStable) {
        const countAttributePage = await getElementsAttribute(page, elementIdentifier);
        return countAttributePage === +count
          ? { result: WaitForResult.PASS }
          : { result: WaitForResult.FAIL, replace: `Ожидалось ${count} элементов, фактический результат - ${countAttributePage}` };
      }
      return {
        result: WaitForResult.ELEMENT_NOT_AVAILABLE,
        replace: `Элемент ${elementIdentifier} не доступен, проверьте доступность элемента в DOM`
      };
    }, globalConfig, {target: attributeKey});
  }
);
