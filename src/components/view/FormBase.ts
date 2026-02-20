import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class FormBase<T> extends Component<T> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
    protected submitEventName: string,
  ) {
    super(container);

    this._submit = this.container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    this._errors = this.container.querySelector(".form__errors") as HTMLElement;

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate();
      if (!this._submit.disabled) {
        this.events.emit(this.submitEventName);
      }
    });
  }

  set errors(value: string) {
    this._errors.textContent = value ?? "";
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  abstract validate(): void;
}
