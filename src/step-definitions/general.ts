import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";

Then(/^Я ожидаю "([^"]*)" секунд$/, async function (this: ScenarioWorld, waitSeconds: string) {
  const {
    screen: { page },
  } = this;

  console.log(`Я ожидаю ${waitSeconds} секунд`);

  await page.waitForTimeout(parseInt(waitSeconds, 10) * 1000);
});
