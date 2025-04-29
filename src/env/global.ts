export type PageId = string;
export type ElementKey = string;
export type ElementLocator = string;
export type PageElementsMappings = Record<PageId, Record<ElementKey, ElementLocator>>;
export type PagesConfig = Record<PageId, Record<string, string>>;
export type HostsConfig = Record<string, string>;
export type WaitForTarget = PageId | ElementKey;
export type WaitForTargetType = string
export type MockConfigKey = string
export type MocksConfig = Record<string, string>
export type MockPayloadMappings = Record<string, Record<string, string>>
export type MockServerKey = string
export type MockPayloadKey = string
export type GlobalStorage = {[key: string]: string}
export type ErrorsConfig = ErrorConfig[]

export type ErrorConfig = {
  originalErrMsgRegexString: string,
  parsedErrMsg: string
}

export type GlobalConfig = {
  pageElementMappings: PageElementsMappings;
  pagesConfig: PagesConfig;
  hostsConfig: HostsConfig;
  mocksConfig: MocksConfig,
  mockPayloadMappings: MockPayloadMappings
  errorsConfig: ErrorsConfig
};

