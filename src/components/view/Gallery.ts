import { Component } from "../base/Component";

export class Gallery extends Component<HTMLElement[]> {
  protected _items: HTMLElement[] = [];

  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this._items = items;
    this.render();
  }

  render(): HTMLElement {
    this.container.replaceChildren(...this._items);
    return this.container;
  }
}
