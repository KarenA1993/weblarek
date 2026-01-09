import { Api } from "./Api";
import { IProduct, IOrder } from "../../types";
import { PRODUCT_URL, ORDER_URL } from "../../utils/constants";

export class LarekApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  // Получить каталог товаров
  getProducts(): Promise<IProduct[]> {
    return this.api
      .get<{ items: IProduct[] }>(PRODUCT_URL)
      .then((response) => response.items);
  }

  // Отправить заказ
  postOrder(order: IOrder): Promise<unknown> {
    return this.api.post(ORDER_URL, order);
  }
}
