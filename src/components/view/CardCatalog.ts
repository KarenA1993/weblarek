import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardBase } from "./CardBase";

export class CardCatalog extends CardBase<IProduct> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._title = this.container.querySelector(".card__title") as HTMLElement;
    this._image = this.container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this._price = this.container.querySelector(".card__price") as HTMLElement;
    this._category = this.container.querySelector(
      ".card__category",
    ) as HTMLElement;

    this.container.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit("card:select", { id });
      }
    });
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set image(value: string) {
    this.setCdnImage(this._image, value, this._title.textContent || "");
  }

  set price(value: number | null) {
    this._price.textContent = this.formatPrice(value);
  }

  set category(value: string) {
    this.setCategory(this._category, value);
  }
}
