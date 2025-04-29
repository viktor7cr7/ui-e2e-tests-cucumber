import { Then } from "@cucumber/cucumber";
import { ElementLocator } from "../../env/global";
import { ScenarioWorld } from "../setup/world";
import { getElementLocator } from "../../support/web-element-helper";
import { waitFor, WaitForResult, waitForSelector, waitForSelectorAtIndex } from "../../support/wait-for-behavior";
import { getElementFromTable } from "../../support/table-behavior";
import { getElements } from "../../support/html-behavior";

Then(
  /^"((?:[0-9]+ой|ый)|последний)" элемент "([^"]+)" в таблице "([^"]+)" (не )?должен быть равен значению "(.+)"$/,
  async function (
    this: ScenarioWorld,
    elementPosition: string,
    elementKey: ElementLocator,
    tableLocator: ElementLocator,
    negate: boolean,
    expectedElementText: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(
      `${elementPosition} элемент ${elementKey} в таблице ${tableLocator} ${
        negate ? "не " : ""
      } должен быть равен значению ${expectedElementText}`
    );

    const elementIdentifier = getElementLocator(page, elementKey, globalConfig);
    const elementTableIdentifier = getElementLocator(page, tableLocator, globalConfig);

    const index =
      elementPosition === "последнего"
        ? (await getElements(page, elementIdentifier))!.length - 1
        : Number(elementPosition.replace(/\D/g, "")) - 1;

    await waitFor(async () => {
      const elementStable = await waitForSelectorAtIndex(page, elementIdentifier, index);
      const elementStableTable = await waitForSelector(page, elementTableIdentifier);

      if (elementStable && elementStableTable) {
        const elementTable = await getElementFromTable(page, elementTableIdentifier, elementIdentifier, index);
        return (elementTable === expectedElementText) === !negate
          ? { result: WaitForResult.PASS }
          : {
              result: WaitForResult.FAIL,
              replace: `Не пройдено условие: ${elementPosition} элемент ${elementKey} в таблице ${tableLocator} ${
                negate ? "не " : ""
              } должен быть равен значению ${expectedElementText}`,
            };
      }
      return {
        result: WaitForResult.ELEMENT_NOT_AVAILABLE,
        replace: `Элемент ${elementIdentifier} и/или ${elementTableIdentifier} не находятся в состоянии visible, проверьте состояние элементов в DOM`,
      };
    }, globalConfig, {target: elementKey});
  }
);
