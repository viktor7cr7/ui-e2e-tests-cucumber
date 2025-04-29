import { ElementHandle, Page } from "playwright";
import { ElementLocator } from "../env/global";
import { getNumberText } from "./html-behavior";
import { dateNormalize } from "./date-normalize-behavior";

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
        console.log(prevDate)
        return true;
      }
      console.log(currentDate)
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

export const checkSortElementsDate = async (elemens: ElementHandle<HTMLElement | SVGAElement>[], sortOption: string, localeDate?: boolean) => {
  const datesNormalize = Promise.all(
    elemens.map(async (date) => {
      const textDate = (await date.textContent()) as string;
      if (localeDate) {
        const date = dateNormalize(textDate);
      const [day, month, year] = date.split(".");
      return `${month}.${day}.${year}`;
      } else {
        return textDate
      }
    })
  );

  return sortDates(await datesNormalize, sortOption);
};
