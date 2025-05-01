import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { getElementLocator } from "../../support/web-element-helper";
import { ElementKey } from "../../env/global";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../../support/wait-for-behavior";
import { getElements, getElementText, getElementTextAtIndex } from "../../support/html-behavior";
import { dateNormalize } from "../../support/date-normalize-behavior";
import { checkSortElementsDate } from "../../support/sort-elements-behavior";
import { ElementHandle } from "playwright";

Then(/^Дата элемента "([^"]+)" должна быть равна сегодняшней дате$/, async function (this: ScenarioWorld, elementKey: ElementKey) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  console.log(`Дата элемента ${elementKey} должна быть равна сегодняшней дате`);

  const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

  await waitFor(
    async () => {
      const elementStable = await waitForSelector(page, elementIdentifier, { state: "attached" });

      if (elementStable) {
        const elementText = (await getElementText(page, elementIdentifier)) as string;
        const clearDate = dateNormalize(elementText);

        if (clearDate === new Date().toLocaleDateString()) {
          return {
            result: WaitForResult.PASS,
          };
        } else {
          return {
            result: WaitForResult.FAIL,
            replace: `Дата ${clearDate} элемента ${elementKey} не равна сегодняшней дате ${new Date().toLocaleDateString()}`,
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
});

Then(
  /^Дата "((?:[0-9]го)|последнего)" элемента "([^"]+)" должна быть равна сегодняшней дате$/,
  async function (this: ScenarioWorld, positionElement: string, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Дата ${positionElement} ${elementKey} элемента должна быть равна сегодняшней дате`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    const index =
      positionElement === "последнего"
        ? await (await getElements(page, elementIdentifier)).count() - 1
        : Number(positionElement.replace(/\D/g, "")) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index, { state: "attached" });

        if (elementStable) {
          const elementText = (await getElementTextAtIndex(page, elementIdentifier, index)) as string;
          const clearDate = dateNormalize(elementText);

          if (clearDate === new Date().toLocaleDateString()) {
            return {
              result: WaitForResult.PASS,
            };
          } else {
            return {
              result: WaitForResult.FAIL,
              replace: `Дата ${clearDate} ${positionElement} элемента ${elementKey} не равна сегодняшней дате ${new Date().toLocaleDateString()}`,
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
  /^Элементы "([^"]+)" отсортированы по (убыванию|возрастанию) (local )?даты$/,
  async function (this: ScenarioWorld, elementKey, sortOption, local: boolean) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Элементы ${elementKey} отсортированы по ${sortOption} ${local ? "local" : ""} даты`);

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = (await getElements(page, elementIdentifier)).count() != null;

        if (elementStable) {
          const elementsDate = (await getElements(page, elementIdentifier));
          return (await checkSortElementsDate(elementsDate, sortOption, local))
            ? { result: WaitForResult.PASS }
            : { result: WaitForResult.FAIL, replace: `Элементы не отсортированы по ${sortOption}` };
        }
        return {
          result: WaitForResult.ELEMENT_NOT_AVAILABLE,
          replace: `Элементы ${elementIdentifier} не доступны, проверьте доступность элемента в DOM`,
        };
      },
      globalConfig,
      { target: elementKey }
    );
  }
);
