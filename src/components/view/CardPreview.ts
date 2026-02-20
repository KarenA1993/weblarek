import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardBase } from "./CardBase";

export class CardPreview extends CardBase<IProduct> {
  protected _image: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  private _inBasket = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._image = this.container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this._title = this.container.querySelector(".card__title") as HTMLElement;
    this._category = this.container.querySelector(
      ".card__category",
    ) as HTMLElement;
    this._description = this.container.querySelector(
      ".card__text",
    ) as HTMLElement;
    this._price = this.container.querySelector(".card__price") as HTMLElement;
    this._button = this.container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    this._button.addEventListener("click", () => {
      if (!this._id || this._button.disabled) return;

      if (this._inBasket) {
        this.events.emit("basket:remove", { id: this._id });
      } else {
        this.events.emit("basket:add", { id: this._id });
      }
    });
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set image(value: string) {
    this.setCdnImage(this._image, value, this._title.textContent || "");
  }

  set price(value: number | null) {
    if (value === null) {
      this._price.textContent = "Бесценно";
      this._button.textContent = "Недоступно";
      this._button.disabled = true;
      this._inBasket = false;
      return;
    }

    this._price.textContent = `${value.toLocaleString("ru-RU")} синапсов`;
    this._button.disabled = false;

    // если товар доступен — текст кнопки зависит от состояния
    this._button.textContent = this._inBasket ? "Удалить из корзины" : "Купить";
  }

  set category(value: string) {
    this.setCategory(this._category, value);
  }

  set inBasket(value: boolean) {
    this._inBasket = value;
    if (this._button.disabled) return;
    this._button.textContent = value ? "Удалить из корзины" : "Купить";
  }
}
