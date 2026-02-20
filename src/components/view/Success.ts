import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected _desc: HTMLElement;
  protected _close: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._desc = this.container.querySelector(
      ".order-success__description",
    ) as HTMLElement;
    this._close = this.container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;

    this._close.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    const formatted = value.toLocaleString("ru-RU");
    this._desc.textContent = `Списано ${formatted} синапсов`;
  }
}
