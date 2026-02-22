import { IProduct } from "../../types";
import { CardBase } from "./CardBase";
import { CDN_URL, categoryMap } from "../../utils/constants";

export class CardCatalog extends CardBase<IProduct> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;

  constructor(
    container: HTMLElement,
    private onSelect: () => void,
  ) {
    super(container);

    this._title = this.container.querySelector(".card__title")!;
    this._image = this.container.querySelector(".card__image")!;
    this._price = this.container.querySelector(".card__price")!;
    this._category = this.container.querySelector(".card__category")!;

    this.container.addEventListener("click", () => {
      this.onSelect();
    });
  }

  set title(value: string) {
    this._title.textContent = value;
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
}
