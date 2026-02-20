import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CDN_URL, categoryMap } from "../../utils/constants";

export abstract class CardBase<T> extends Component<T> {
  protected _id = "";

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
  }

  set id(value: string) {
    this._id = value;
    this.container.dataset.id = value;
  }

  protected formatPrice(value: number | null): string {
    if (value === null) return "Недоступно";
    return `${value.toLocaleString("ru-RU")} синапсов`;
  }

  protected setCategory(el: HTMLElement, value: string): void {
    el.textContent = value;
    const className =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    el.className = `card__category ${className}`;
  }

  protected setCdnImage(img: HTMLImageElement, src: string, alt: string): void {
    const normalized = src.startsWith("/") ? src.slice(1) : src;
    this.setImage(img, `${CDN_URL}/${normalized}`, alt);
  }
}
