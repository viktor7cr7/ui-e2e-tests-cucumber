import { Given } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import { ElementKey, PageId } from "../env/global";
import { currentPathMatchesPageId, getCurrentMathPageId, navigateToPage } from "../support/navigation-behavior";
import { waitFor, WaitForResult } from "../support/wait-for-behavior";

Given(/^Я нахожусь на странице "([^"]+)"$/, async function (this: ScenarioWorld, pageId: ElementKey) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  console.log(`Я нахожусь на странице ${pageId}`);

  await navigateToPage(page, pageId, globalConfig);

  await waitFor(() => currentPathMatchesPageId(page, pageId, globalConfig), globalConfig, {
    target: pageId,
    type: "page",
  });
});

Given(/^Я перенаправляюсь на страницу "([^"]+)"/, async function (this: ScenarioWorld, pageId: PageId) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  console.log(`Я перенаправляюсь на страницу ${pageId}`);

  await waitFor(() => currentPathMatchesPageId(page, pageId, globalConfig), globalConfig, {
    target: pageId,
    type: "page",
  });
});
