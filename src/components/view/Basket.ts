import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export type TBasketViewData = {
  items: HTMLElement[];
  total: number;
};

export class Basket extends Component<TBasketViewData> {
  protected _list: HTMLUListElement;
  protected _priceEl: HTMLElement;
  protected _buttonOrder: HTMLButtonElement;

  constructor(
    container: HTMLDivElement,
    protected events: IEvents,
  ) {
    super(container);

    this._list = this.container.querySelector(
      ".basket__list",
    ) as HTMLUListElement;
    this._priceEl = this.container.querySelector(
      ".basket__price",
    ) as HTMLElement;
    this._buttonOrder = this.container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    this._buttonOrder.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  render(data?: Partial<TBasketViewData>): HTMLElement {
    if (data) {
      const items = data.items ?? [];

      if (items.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "Корзина пуста";
        this._list.replaceChildren(empty);
      } else {
        this._list.replaceChildren(...items);
      }

      const total = data.total ?? 0;
      this._priceEl.textContent = `${total.toLocaleString("ru-RU")} синапсов`;

      this._buttonOrder.disabled = items.length === 0;
    }

    return this.container;
  }
}
