import { Page } from "playwright";
import { envNumber } from "../env/parseEnv";
import { ElementLocator, GlobalConfig, WaitForTarget, WaitForTargetType } from "../env/global";
import { handleError } from "./error-helper";

type WaitForSelectorState = "visible" | "attached" | "detached" | "hidden";

export const enum WaitForResult {
  PASS = 1,
  FAIL = 2,
  ELEMENT_NOT_AVAILABLE = 3,
}

export type WaitForResultWithContext = {
  result: WaitForResult;
  replace?: string;
};

export async function waitFor(
  cb: () => WaitForResult | Promise<WaitForResult> | WaitForResultWithContext | Promise<WaitForResultWithContext>,
  globalConfig: GlobalConfig,
  options?: { timeout?: number; wait?: number; target?: WaitForTarget; type?: WaitForTargetType; failureMessage?: string }
): Promise<void> {
  const { timeout = 25000, wait = 2000, target = "", type = "элемент" } = options || {};

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const startDate = new Date();
  let notAvailableContext: string | undefined;

  try {
    while (new Date().getTime() - startDate.getTime() < timeout) {
      const result = await cb();
      let resultAs: WaitForResult;
      if ((result as WaitForResultWithContext).result) {
        notAvailableContext = (result as WaitForResultWithContext).replace;
        resultAs = (result as WaitForResultWithContext).result;
      } else {
        resultAs = result as WaitForResult;
      }

      if (resultAs === WaitForResult.PASS) {
        return;
      } else if (resultAs === WaitForResult.FAIL) {
        throw new Error(notAvailableContext || options?.failureMessage || "");
      }

      console.log(`Waiting ${wait}ms`);

      await sleep(wait);
    }
    throw new Error(`Время ожидания ${timeout}мс для ${notAvailableContext || target} превышено`);
  } catch (error) {
    handleError(globalConfig.errorsConfig, error as Error, target, type);
  }
}

export const waitForSelector = async (
  page: Page,
  elementIdentifier: ElementLocator,
  options?: {
    state?: WaitForSelectorState;
    timeoutMs?: number;
  }
): Promise<boolean> => {
  const { state = "visible", timeoutMs = envNumber("SELECTOR_TIMEOUT") } = options || {};
  console.log(state);
  console.log(elementIdentifier);
  try {
    await page.waitForSelector(elementIdentifier, {
      state,
      timeout: timeoutMs,
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const waitForSelectorAtIndex = async (
  page: Page,
  elementIdentifier: ElementLocator,
  position: number,
  options?: {
    state?: WaitForSelectorState;
    timeoutMs?: number;
  }
): Promise<boolean> => {
  const { state = "visible", timeoutMs = envNumber("SELECTOR_TIMEOUT") } = options || {};
  try {
    await page.waitForSelector(`${elementIdentifier}>>nth=${position}`, {
      state,
      timeout: timeoutMs,
    });
    return true;
  } catch (e) {
    return false;
  }
};
