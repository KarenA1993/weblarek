import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { BasketModel } from "../Models/BasketModel";
import { CardBasket } from "./CardBasket";

export class Basket extends Component<unknown> {
  protected _list: HTMLUListElement;
  protected _priceEl: HTMLElement;
  protected _buttonOrder: HTMLButtonElement;

  protected _itemTemplate: HTMLTemplateElement;

  constructor(
    container: HTMLDivElement,
    protected events: IEvents,
    protected basketModel: BasketModel,
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

    this._itemTemplate = document.querySelector(
      "#card-basket",
    ) as HTMLTemplateElement;

    this._buttonOrder.addEventListener("click", () => {
      this.events.emit("order:open");
    });

    this.events.on("basket:changed", () => this.render());

    this.render();
  }

  render(): HTMLElement {
    const items = this.basketModel.getItems();

    // список
    this._list.replaceChildren();

    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Корзина пуста";
      this._list.append(empty);
    } else {
      items.forEach((item, index) => {
        const node = this._itemTemplate.content.firstElementChild!.cloneNode(
          true,
        ) as HTMLLIElement;
        const card = new CardBasket(node, this.events);

        this._list.append(
          card.render({
            index: index + 1,
            id: item.id,
            title: item.title,
            price: item.price,
          }),
        );
      });
    }

    // сумма
    const total = this.basketModel.getTotal();
    const formattedTotal = total.toLocaleString("ru-RU");
    this._priceEl.textContent = `${formattedTotal} синапсов`;

    // кнопка оформить
    this._buttonOrder.disabled = items.length === 0;

    return this.container;
  }
}
