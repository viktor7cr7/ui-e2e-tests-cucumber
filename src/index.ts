import * as dotenv from "dotenv";
import { env, getJsonFromFile } from "./env/parseEnv";
import {
  EmailsConfig,
  ErrorsConfig,
  GlobalConfig,
  HostsConfig,
  MockPayloadMappings,
  MocksConfig,
  PageElementsMappings,
  PagesConfig,
} from "./env/global";
import fs from "fs";
import path from "path";

const environment = env("NODE_ENV");
dotenv.config({ path: env("COMMON_CONFIG_FILE") });
dotenv.config({ path: `${env("ENV_PATH")}${environment}.env` });

const hostsConfig: HostsConfig = getJsonFromFile(env("HOSTS_URLS_PATH"));
const pagesConfig: PagesConfig = getJsonFromFile(env("PAGE_URLS_PATH"));
const mocksConfig: MocksConfig = getJsonFromFile(env("MOCKS_URLS_PATH"));
const errorsConfig: ErrorsConfig = getJsonFromFile(env("ERRORS_URLS_PATH"));
const emailsConfig: EmailsConfig = getJsonFromFile(env("EMAILS_PATH"));

const pagesElementMappings = (dirPath: string): Record<string, Record<string, string>> => {
  const collectionFiles = {} as PageElementsMappings;
  const mappingFiles = fs.readdirSync(dirPath);

  mappingFiles.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isFile() && file.endsWith(".json")) {
      const fileKey = file.replace(".json", "");
      collectionFiles[fileKey] = getJsonFromFile(fullPath);
    } else if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(collectionFiles, pagesElementMappings(fullPath));
    }
  });

  return collectionFiles;
};

const pageElementMappings: PageElementsMappings = pagesElementMappings(path.join(process.cwd(), env("PAGE_ELEMENTS_PATH")));
const mockPayloadMappings: MockPayloadMappings = pagesElementMappings(path.join(process.cwd(), env("MOCK_PAYLOAD_PATH")));

const worldParameters: GlobalConfig = {
  pagesConfig,
  pageElementMappings,
  hostsConfig,
  mocksConfig,
  mockPayloadMappings,
  errorsConfig,
  emailsConfig,
};

const common = `./src/features/**/*.feature \
                --require ./dist/step-definitions/**/**/*.js \
                -f json:./reports/report.json \
                --world-parameters ${JSON.stringify(worldParameters)}`;

const dev = `${common} --tags '@dev'`;
const smoke = `${common} --tags '@smoke'`;
const regression = `${common} --tags '@regression'`;
const zephyr = `${common} --tags '@zephyr'`

export { dev, smoke, regression, zephyr };
