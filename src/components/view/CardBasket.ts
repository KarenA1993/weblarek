import { CardBase } from "./CardBase";

export interface ICardBasketProps {
  index: number;
  title: string;
  price: number | null;
}

export class CardBasket extends CardBase<ICardBasketProps> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(
    container: HTMLLIElement,
    private onRemove: () => void,
  ) {
    super(container);

    this._index = this.container.querySelector(
      ".basket__item-index",
    ) as HTMLElement;

    this._deleteButton = this.container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    this._deleteButton.addEventListener("click", () => {
      this.onRemove();
    });
  }

  set index(value: number) {
    this._index.textContent = value.toString();
  }
}
