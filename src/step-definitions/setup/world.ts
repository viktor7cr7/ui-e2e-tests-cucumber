import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { GlobalConfig, GlobalStorage } from "../../env/global";
import playwright, { APIRequestContext, Browser, BrowserContext, BrowserContextOptions, BrowserType, Page, request } from "playwright";
import { env } from "../../env/parseEnv";

export type Screen = {
  browser: Browser;
  page: Page;
  context: BrowserContext;
};

export class ScenarioWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
    this.globalConfig = options.parameters as GlobalConfig;
    this.globalStorage = {};
    this.initialize();
  }

  globalConfig: GlobalConfig;
  globalStorage: GlobalStorage;
  screen!: Screen;
  request!: APIRequestContext;

  async initialize() {
    this.request = await request.newContext();
  }

  async init(contextOptons?: BrowserContextOptions) {
    await this.screen?.page?.close();
    await this.screen?.context?.close();
    await this.screen?.browser?.close();

    const browser = await this.newBrowser();
    const context = await browser.newContext(contextOptons);
    const page = await context.newPage();

    this.screen = { browser, context, page };

    return this.screen;
  }

  private newBrowser = async (): Promise<Browser> => {
    const automationBrowsers = ["chromium", "webkit", "firefox"] as const;
    type AutomationBrowser = (typeof automationBrowsers)[number];
    const automationBrowser = env("UI_AUTOMATION_BROWSER") as AutomationBrowser;

    const browserType: BrowserType = playwright[automationBrowser];
    const browser = browserType.launch({
      devtools: process.env.DEVTOOLS !== "false",
      headless: process.env.HEADLESS !== "false",
      args: ["--disable-web-security", "--disable-features=IsolateOrigins, site-per-process"],
    });

    return browser;
  };
}

setWorldConstructor(ScenarioWorld);
