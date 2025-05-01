import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { ElementKey } from "../../env/global";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { getElements } from "../../support/html-behavior";

Then(/^Элемент "([^"]+)" (не )?должен отображаться$/, async function (this: ScenarioWorld, elementKey: ElementKey, negate: boolean) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  console.log(`Элемент ${elementKey} ${negate ? "не " : ""}должен отображаться`);

  const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

  await waitFor(
    async () => {
      const isElementVisible = await waitForSelector(page, elementIdentifier, { state: negate ? "hidden" : "visible" });
      console.log(isElementVisible);
      if (isElementVisible) {
        return WaitForResult.PASS;
      }
      return WaitForResult.FAIL;
    },
    globalConfig,
    { target: elementKey, failureMessage: `Элемент ${elementKey} ${negate ? "не " : ""}должен отображаться` }
  );
});

Then(
  /^Только "([0-9]+)" элемент(?:ов|а)? "([^"]+)" долж(?:ны|ен) отображаться на странице$/,
  async function (this: ScenarioWorld, countElements: string, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Только ${countElements} ${elementKey} должны отображаться на странице`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementsStable = await waitForSelector(page, elementIdentifier);

        if (elementsStable) {
          const count = await (await getElements(page, elementIdentifier)).count();
          if (count) {
            return count === Number(countElements)
              ? { result: WaitForResult.PASS }
              : {
                  result: WaitForResult.FAIL,
                  replace: `Текущее количество отображаемых элементов ${count} не совпадает с ожидаемым ${countElements}`,
                };
          }
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элементы ${elementKey} должны отображаться на странице`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);

Then(
  /^"((?:[0-9]+(?:ый|ой|ий)|последний))" элемент "([^"]*)" (не )?должен отображаться$/,
  async function (this: ScenarioWorld, positionElement: string, elementKey: ElementKey, negate: boolean) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`${positionElement} элемент ${elementKey} ${negate ? "не" : ""} должен отображаться`);

    const index =
      positionElement === "последнего"
        ? await (await getElements(page, positionElement)).count() - 1
        : Number(positionElement.replace(/\D/g, "")) - 1;

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index, { state: negate ? "hidden" : "visible" });
        if (elementStable) {
          return WaitForResult.PASS;
        } else {
          return WaitForResult.ELEMENT_NOT_AVAILABLE;
        }
      },
      globalConfig,
      { failureMessage: `${positionElement} элемент ${elementKey} ${negate ? "не" : ""} должен отображаться`, target: elementKey }
    );
  }
);
