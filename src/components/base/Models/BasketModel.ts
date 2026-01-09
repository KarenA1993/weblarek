import { IProduct } from "../../../types";

export class BasketModel {
  // Товары добавленные в корзину
  private items: IProduct[] = [];

  //Получить все товары в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавить товар в корзину
  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
    }
  }

  // Удалить товар из корзины
  removeItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
  }

  // Очистить корзину
  clear(): void {
    this.items = [];
  }

  // получить общую стоимость товаров
  getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.price ?? 0);
    }, 0);
  }

  // Получить каличество товаров в корзине
  getCount(): number {
    return this.items.length;
  }

  // Проверить есть ли товар в корзине
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
