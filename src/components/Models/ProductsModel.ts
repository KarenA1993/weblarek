import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsModel {
  // Все товары каталога
  private items: IProduct[] = [];

  // Выбранный товар для подробного просмотра
  private selected: IProduct | null = null;

  constructor(private events: IEvents) {}

  // Сохранить массив товаров
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("products:changed");
  }

  // Получить все товары
  getItems(): IProduct[] {
    return this.items;
  }

  // Получить товар по id
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохранить выбранный товар
  setSelected(item: IProduct): void {
    this.selected = item;
    this.events.emit("product:selected");
  }

  // Получить выбранный товар
  getSelected(): IProduct | null {
    return this.selected;
  }
}
