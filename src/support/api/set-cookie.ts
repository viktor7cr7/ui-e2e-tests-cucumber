import { Page } from "playwright";
import { env } from "../../env/parseEnv";

export const setCookie = async (page: Page): Promise<void> => {
  const response = await page.request.post(`${env("HOST")}/api/v1/auth/login`, {
    data: { userType: "user", email: "test-email@mail.ru", password: "BETejEmm321" },
  });
  const setCookieHeader = response.headers()["set-cookie"];

  if (setCookieHeader) {
    const cookiesArray = setCookieHeader.split("; ");

    const parsedCookies = cookiesArray.map((cookieStr) => {
      const [name, value] = cookieStr.split("=")[0];
      return {
        name,
        value,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        expires: Date.now() / 1000 + 24 * 60 * 60,
      };
    });
    
    await page.context().addCookies(parsedCookies);
  }
};
