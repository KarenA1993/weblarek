import { IEvents } from "../base/Events";
import { FormBase } from "./FormBase";

export interface IContactsFormData {
  email: string;
  phone: string;
  errors?: string;
  valid?: boolean;
}

export class ContactsForm extends FormBase<IContactsFormData> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "contacts:submit");

    this._email = this.container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;

    this._phone = this.container.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    this._email.addEventListener("input", () => {
      this.events.emit("buyer:update", { email: this._email.value });
      this.validate();
    });

    this._phone.addEventListener("input", () => {
      this.events.emit("buyer:update", { phone: this._phone.value });
      this.validate();
    });

    this.validate();
  }

  set email(value: string) {
    this._email.value = value ?? "";
    this.validate();
  }

  set phone(value: string) {
    this._phone.value = value ?? "";
    this.validate();
  }

  validate(): void {
    const emailOk = this._email.value.trim().length > 0;
    const phoneOk = this._phone.value.trim().length > 0;

    const errors: string[] = [];
    if (!emailOk) errors.push("Введите email");
    if (!phoneOk) errors.push("Введите телефон");

    this.errors = errors.join(". ");
    this.valid = errors.length === 0;
  }
}
