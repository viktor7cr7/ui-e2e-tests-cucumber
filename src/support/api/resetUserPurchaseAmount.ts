import { APIRequest, APIRequestContext } from "playwright";
import { env } from "../../env/parseEnv"

export const resetUserPurchaseAmount = async (request: APIRequestContext, userId: string) => {
    const response = await request.post(`${env("HOST")}/api/v1/support/${userId}`);
  
    if (response.status() !== 200) {
      throw new Error("Ошибка при сбросе суммы покупок пользователя");
    }
  };