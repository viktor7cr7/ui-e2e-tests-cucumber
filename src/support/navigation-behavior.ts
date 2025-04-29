import { Page } from "playwright-core";
import { GlobalConfig, PageId } from "../env/global";
import { WaitForResult } from "./wait-for-behavior";

export const navigateToPage = async (page: Page, pageId: PageId, {pagesConfig, hostsConfig}: GlobalConfig): Promise<void> => {
    const {UI_AUTOMATION_HOST: hostname = 'localhost'} = process.env
    
    const hostConfig = hostsConfig[hostname]

    const url = new URL(hostConfig)

    const pageConfigItem = pagesConfig[pageId]
    url.pathname = pageConfigItem.route

    await page.goto(url.href, {waitUntil: 'networkidle'})
};

const pathMatchesPageId = (path: string, pageId: PageId, {pagesConfig}: GlobalConfig): boolean => {
    const pageRegexString = pagesConfig[pageId].regex
    const pageRegex = new RegExp(pageRegexString)
    return pageRegex.test(path)
} 

export const currentPathMatchesPageId = (
    page: Page,
    pageId: PageId,
    globalConfig: GlobalConfig
): WaitForResult => {
    const { pathname: currentPath } = new URL(page.url())
    if (pathMatchesPageId(currentPath, pageId, globalConfig)) {
        return WaitForResult.PASS
    }
    return WaitForResult.ELEMENT_NOT_AVAILABLE
}

export const getCurrentMathPageId = (page: Page, globalConfig): PageId => {
    const {pagesConfig} = globalConfig

    const pageConfigPageIds = Object.keys(pagesConfig)

    const {pathname: currentPath} = new URL(page.url())

    const currentPageId = pageConfigPageIds.find(pageId => pathMatchesPageId(currentPath, pageId, globalConfig))
    if (!currentPageId) {
        throw Error(
            `Не удалось получить имя страницы из текущего маршрута ${currentPath}, \
      возможные маршруты: ${JSON.stringify(pagesConfig)}`
        );
    }
    return currentPageId;
}