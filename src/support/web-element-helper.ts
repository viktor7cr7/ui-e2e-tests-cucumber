import { Page } from "playwright";
import { ElementKey, GlobalConfig } from "../env/global";
import { getCurrentMathPageId } from "./navigation-behavior";

export const getElementLocator = (page: Page, elementKey: ElementKey, globalConfig: GlobalConfig) => {
  const { pageElementMappings } = globalConfig;

  const currentPage = getCurrentMathPageId(page, globalConfig);
  return pageElementMappings[currentPage]?.[elementKey] || pageElementMappings["dashboard"][elementKey];
};
