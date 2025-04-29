import { Given } from "@cucumber/cucumber";
import { resetUserPurchaseAmount } from "../support/api/resetUserPurchaseAmount";
import { ScenarioWorld } from "./setup/world";

Given(/^Cумма покупок пользователя "([0-9]+)" обнулена$/, async function (this: ScenarioWorld, idUser: string) {
  const { request } = this;
  await resetUserPurchaseAmount(request, idUser);
  return true;
});
