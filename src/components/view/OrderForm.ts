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
  protected _idAddress = "address";

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "order:submit");

    this._buttons = Array.from(
      this.container.querySelectorAll<HTMLButtonElement>(
        ".order__buttons .button",
      ),
    );

    this._address = this.container.querySelector(
      `input[name="${this._idAddress}"]`,
    ) as HTMLInputElement;

    this._buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.name as TPayment;
        this.payment = name;
        this.events.emit("buyer:update", { payment: name });
      });
    });

    this._address.addEventListener("input", () => {
      this.events.emit("buyer:update", { address: this._address.value });
      this.validate();
    });

    this.validate();
  }

  set payment(value: TPayment | "") {
    this._payment = value;

    this._buttons.forEach((btn) => {
      btn.classList.toggle("button_alt-active", btn.name === value);
    });

    this.validate();
  }

  set address(value: string) {
    this._address.value = value ?? "";
    this.validate();
  }

  validate(): void {
    const addressOk = this._address.value.trim().length > 0;
    const paymentOk = this._payment !== "";

    const errors: string[] = [];
    if (!paymentOk) errors.push("Выберите способ оплаты");
    if (!addressOk) errors.push("Введите адрес доставки");

    this.errors = errors.join(". ");
    this.valid = errors.length === 0;
  }
}
