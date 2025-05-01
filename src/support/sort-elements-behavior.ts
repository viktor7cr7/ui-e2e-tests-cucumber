import { ElementHandle, Locator, Page } from "playwright";
import { ElementLocator } from "../env/global";
import { getNumberText } from "../support/html-helper";
import { dateNormalize } from "./date-normalize-behavior";
import { locatorToArray } from "./locator-helper";

export const sortTextElements = async (elementsNumber: number[] | string[], optionSort: string): Promise<boolean> => {
  const sort = optionSort === "убыванию" ? "desc" : "asc";
  function sortAscending(values: number[] | string[]) {
    return values.every((value, index) => {
      if (index === 0) {
        return true;
      }
      if (value >= values[index - 1]) {
        return true;
      }
    });
  }

  function sortDescending(values: number[] | string[]) {
    return values.every((value, index) => {
      if (index === 0) {
        return true;
      }
      if (value <= values[index - 1]) {
        return true;
      }
    });
  }

  switch (sort) {
    case "asc":
      return sortAscending(elementsNumber);
    case "desc":
      return sortDescending(elementsNumber);
    default:
      throw Error("Укажите опцию сортировки: asc|desc");
  }
};

export const sortNumberElements = async (page: Page, elementIdentifier: ElementLocator, optionSort: string): Promise<boolean> => {
  const elements = await page.$$(elementIdentifier);
  return sortTextElements(await getNumberText(elements), optionSort);
};

export const sortDates = (dates: string[], sortOption: string): boolean => {
  const sort = sortOption === "убыванию" ? "desc" : "asc";
  function sortDateDescending(dates: string[]) {
    return dates.every((_, index) => {
      if (index === 0) return true;
      const prevDate = dates[index - 1];
      const currentDate = dates[index];
      if (new Date(prevDate) >= new Date(currentDate)) {
        return true;
      }
      return false;
    });
  }

  function sortDateAscending(dates: string[]) {
    return dates.every((_, index) => {
      if (index === 0) return true;
      const prevDate = dates[index - 1];
      const currentDate = dates[index];
      if (new Date(prevDate) <= new Date(currentDate)) {
        return true;
      }
      return false;
    });
  }

  switch (sort) {
    case "asc":
      return sortDateAscending(dates);
    case "desc":
      return sortDateDescending(dates);
    default:
      throw Error("Укажите опцию сортировки: asc|desc");
  }
};

export const checkSortElementsDate = async (
  elements: Locator,
  sortOption: string,
  localeDate?: boolean
) => {
  const arrayLocators = await locatorToArray(elements)
  const datesNormalize = Promise.all(
    arrayLocators.map(async (date) => {
      const textDate = (await date.textContent())?.trim() ?? '';
      if (localeDate) {
        const date = dateNormalize(textDate);
        const [day, month, year] = date.split(".");
        return `${month}.${day}.${year}`;
      } else {
        return textDate;
      }
    })
  );

  return sortDates(await datesNormalize, sortOption);
};
