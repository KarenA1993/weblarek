import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<HTMLElement> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _events: IEvents;

  private _modalRoot: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._events = events;

    // Если container уже .modal — ок, иначе берем вложенный .modal
    this._modalRoot =
      (this.container.classList.contains("modal")
        ? this.container
        : (this.container.querySelector(".modal") as HTMLElement)) ||
      this.container;

    this._closeButton = this._modalRoot.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;
    this._content = this._modalRoot.querySelector(
      ".modal__content",
    ) as HTMLElement;

    this._closeButton.addEventListener("click", () => this.close());

    // Клик по оверлею — только если кликнули именно в корень модалки
    this._modalRoot.addEventListener("click", (evt) => {
      if (evt.target === this._modalRoot) {
        this.close();
      }
    });
  }

  set content(node: HTMLElement) {
    this._content.replaceChildren(node);
  }

  open(): void {
    this._modalRoot.classList.add("modal_active");
    document.body.classList.add("page__wrapper_locked");
  }

  close(): void {
    this._modalRoot.classList.remove("modal_active");
    this._content.replaceChildren();
    document.body.classList.remove("page__wrapper_locked");
    this._events.emit("modal:close");
  }
}
