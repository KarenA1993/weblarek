import { IProduct } from "../../types";
import { CardBase } from "./CardBase";
import { CDN_URL, categoryMap } from "../../utils/constants";

export class CardCatalog extends CardBase<IProduct> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(
    container: HTMLElement,
    private onSelect: () => void,
  ) {
    super(container);

    this._image = this.container.querySelector(".card__image")!;
    this._category = this.container.querySelector(".card__category")!;

    this.container.addEventListener("click", () => {
      this.onSelect();
    });
  }

  set image(value: string) {
    this.setImage(
      this._image,
      `${CDN_URL}/${value}`,
      this._titleEl.textContent || "",
    );
  }

  set category(value: string) {
    this._category.textContent = value;
    const className =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this._category.className = `card__category ${className}`;
  }
}
