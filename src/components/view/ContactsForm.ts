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
    });

    this._phone.addEventListener("input", () => {
      this.events.emit("buyer:update", { phone: this._phone.value });
    });
  }

  set email(value: string) {
    this._email.value = value ?? "";
  }

  set phone(value: string) {
    this._phone.value = value ?? "";
  }

  render(data?: Partial<IContactsFormData>): HTMLElement {
    if (data?.email !== undefined) this.email = data.email;
    if (data?.phone !== undefined) this.phone = data.phone;
    if (data?.errors !== undefined) this.errors = data.errors;
    if (data?.valid !== undefined) this.valid = data.valid;
    return this.container;
  }
}
