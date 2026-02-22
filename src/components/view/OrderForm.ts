import { IEvents } from "../base/Events";
import { TPayment } from "../../types";
import { FormBase } from "./FormBase";

export interface IOrderFormData {
  payment: TPayment | "";
  address: string;
  errors?: string;
  valid?: boolean;
}

export class OrderForm extends FormBase<IOrderFormData> {
  protected _buttons: HTMLButtonElement[];
  protected _address: HTMLInputElement;

  protected _payment: TPayment | "" = "";

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "order:submit");

    this._buttons = Array.from(
      this.container.querySelectorAll<HTMLButtonElement>(
        ".order__buttons .button",
      ),
    );

    this._address = this.container.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;

    this._buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.name as TPayment;
        this.events.emit("buyer:update", { payment: name });
      });
    });

    this._address.addEventListener("input", () => {
      this.events.emit("buyer:update", { address: this._address.value });
    });
  }

  set payment(value: TPayment | "") {
    this._payment = value;
    this._buttons.forEach((btn) => {
      btn.classList.toggle("button_alt-active", btn.name === value);
    });
  }

  set address(value: string) {
    this._address.value = value ?? "";
  }

  render(data?: Partial<IOrderFormData>): HTMLElement {
    if (data?.payment !== undefined) this.payment = data.payment;
    if (data?.address !== undefined) this.address = data.address;
    if (data?.errors !== undefined) this.errors = data.errors;
    if (data?.valid !== undefined) this.valid = data.valid;
    return this.container;
  }
}
