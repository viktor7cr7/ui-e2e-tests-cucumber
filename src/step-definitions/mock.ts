import { Given } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import { MockConfigKey, MockPayloadKey, MockServerKey } from "../env/global";
import { interceptResponse } from "../support/mock-behavior";

Given(
  /^Эндпоинт "([^"]*)" для "([^"]+)" мокируется с помощью "([^"]+)"$/,
  async function (this: ScenarioWorld, mockConfigKey: MockConfigKey, mockServerKey: MockServerKey, mockPayloadKey: MockPayloadKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(`Эндпоинт для ${mockServerKey} ${mockConfigKey} мокируется с помощью ${mockPayloadKey}`);

    await interceptResponse(page, mockServerKey, mockConfigKey, mockPayloadKey, globalConfig);
  }
);
