import { Component } from "../base/Component";

export abstract class CardBase<T> extends Component<T> {
  protected formatPrice(value: number | null): string {
    if (value === null) return "Бесценно";
    return `${value.toLocaleString("ru-RU")} синапсов`;
  }
}
