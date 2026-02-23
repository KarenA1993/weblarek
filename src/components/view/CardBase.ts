import { Component } from "../base/Component";

export abstract class CardBase<T> extends Component<T> {
  protected _titleEl: HTMLElement;
  protected _priceEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._titleEl = this.container.querySelector(".card__title") as HTMLElement;
    this._priceEl = this.container.querySelector(".card__price") as HTMLElement;
  }

  set title(value: string) {
    this._titleEl.textContent = value;
  }

  set price(value: number | null) {
    this._priceEl.textContent = this.formatPrice(value);
  }

  protected formatPrice(value: number | null): string {
    if (value === null) return "Бесценно";
    return `${value.toLocaleString("ru-RU")} синапсов`;
  }
}
