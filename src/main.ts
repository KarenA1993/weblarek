import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";

import { ProductsModel } from "./components/Models/ProductsModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

/**
 * Инициализация API
 */
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

/**
 * =========================
 * ProductsModel
 * =========================
 */
const productsModel = new ProductsModel();

// Проверка установки локальных данных
productsModel.setItems(apiProducts.items);
console.log("Каталог (локально):", productsModel.getItems());

// Проверка поиска товара по id
const firstProductId = apiProducts.items[0].id;
console.log("Поиск товара по id:", productsModel.getItemById(firstProductId));

// Проверка выбранного товара
productsModel.setSelected(apiProducts.items[0]);
console.log("Выбранный товар:", productsModel.getSelected());

/**
 * =========================
 * BasketModel
 * =========================
 */
const basketModel = new BasketModel();

// Добавление товаров
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);

console.log("Корзина (после добавления):", basketModel.getItems());
console.log("Количество товаров:", basketModel.getCount());
console.log("Общая стоимость:", basketModel.getTotal());

// Проверка наличия товара
console.log(
  "Товар есть в корзине:",
  basketModel.hasItem(apiProducts.items[0].id)
);

// Удаление товара
basketModel.removeItem(apiProducts.items[0]);
console.log("Корзина (после удаления):", basketModel.getItems());

// Очистка корзины
basketModel.clear();
console.log("Корзина (после очистки):", basketModel.getItems());

/**
 * =========================
 * BuyerModel
 * =========================
 */
const buyerModel = new BuyerModel();

// Частичное заполнение данных
buyerModel.setData({ email: "test@test.com" });
console.log("Покупатель (частично):", buyerModel.getData());
console.log("Ошибки валидации:", buyerModel.validate());

// Полное заполнение данных
buyerModel.setData({
  payment: "card",
  phone: "+37499123456321",
  address: "Yerevan",
});
console.log("Покупатель (полностью):", buyerModel.getData());
console.log("Ошибки после заполнения:", buyerModel.validate());

// Очистка данных покупателя
buyerModel.clear();
console.log("Покупатель (после очистки):", buyerModel.getData());

/**
 * =========================
 * Загрузка данных с сервера
 * =========================
 */
larekApi
  .getProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log("Каталог (сервер):", productsModel.getItems());
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога с сервера:", error);
  });
