import { Page } from "playwright";
import { ElementLocator } from "../env/global";
import path from "path";

export const uploadFile = async (page: Page, elementLocator: ElementLocator, fileName: string) => {
    return await page.locator(elementLocator).setInputFiles(path.join(__dirname, 'test-data', fileName))
}