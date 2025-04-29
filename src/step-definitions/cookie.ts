import { Given } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import { setCookie } from "../support/api/set-cookie";

Given(/^Авторизация через куки$/, async function (this: ScenarioWorld) {
  const {
    screen: { page },
  } = this;

  console.log(`Авторизация через куки`);

  await setCookie(page);
});
