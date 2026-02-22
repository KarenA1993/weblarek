import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardBase } from "./CardBase";
import { CDN_URL, categoryMap } from "../../utils/constants";

export class CardPreview extends CardBase<IProduct> {
  protected _image: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._image = this.container.querySelector(".card__image")!;
    this._title = this.container.querySelector(".card__title")!;
    this._category = this.container.querySelector(".card__category")!;
    this._description = this.container.querySelector(".card__text")!;
    this._price = this.container.querySelector(".card__price")!;
    this._button = this.container.querySelector(".card__button")!;

    this._button.addEventListener("click", () => {
      if (this._button.disabled) return;
      this.events.emit("preview:action");
    });
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set image(value: string) {
    this.setImage(
      this._image,
      `${CDN_URL}/${value}`,
      this._title.textContent || "",
    );
  }

  set price(value: number | null) {
    this._price.textContent = this.formatPrice(value);
  }

  set category(value: string) {
    this._category.textContent = value;
    const className =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this._category.className = `card__category ${className}`;
  }

  // Управление кнопкой снаружи (текст + disabled)
  set buttonText(value: string) {
    this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }
}
