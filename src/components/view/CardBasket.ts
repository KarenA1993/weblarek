import { IEvents } from "../base/Events";
import { CardBase } from "./CardBase";

export interface ICardBasketProps {
  index: number;
  id: string;
  title: string;
  price: number | null;
}

export class CardBasket extends CardBase<ICardBasketProps> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLLIElement, events: IEvents) {
    super(container, events);

    this._index = this.container.querySelector(
      ".basket__item-index",
    ) as HTMLElement;
    this._title = this.container.querySelector(".card__title") as HTMLElement;
    this._price = this.container.querySelector(".card__price") as HTMLElement;
    this._deleteButton = this.container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    this._deleteButton.addEventListener("click", () => {
      if (this._id) {
        this.events.emit("basket:remove", { id: this._id });
      }
    });
  }

  set index(value: number) {
    this._index.textContent = value.toString();
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this._price.textContent = "Бесценно";
      return;
    }
    this._price.textContent = `${value.toLocaleString("ru-RU")} синапсов`;
  }
}
