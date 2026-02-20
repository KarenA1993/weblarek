// src/main.ts
import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";

import { ProductsModel } from "./components/Models/ProductsModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { API_URL } from "./utils/constants";

import { Gallery } from "./components/view/Gallery";

import { EventEmitter } from "./components/base/Events";
import { CardCatalog } from "./components/view/CardCatalog";
import { Modal } from "./components/view/Modal";

import { CardPreview } from "./components/view/CardPreview";
import { Basket } from "./components/view/Basket";

import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";
import { IOrder, IBuyer, TOrderResponse, TPayment } from "./types";

/**
 * Инициализация API
 */
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Инициализация событий
const events = new EventEmitter();

/**
 * =========================
 * ProductsModel
 * =========================
 */
const productsModel = new ProductsModel(events);

/**
 * =========================
 * BuyerModel
 * =========================
 */
const buyerModel = new BuyerModel(events);

/**
 * =========================
 * BasketModel
 * =========================
 */
const basketModel = new BasketModel(events);

/**
 * =========================
 * Загрузка данных с сервера
 * =========================
 */
larekApi
  .getProducts()
  .then((items) => {
    productsModel.setItems(items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога с сервера:", error);
  });

/**
 * =========================
 * Галерея
 * =========================
 */
const galleryElement = document.querySelector(".gallery") as HTMLElement;
const gallery = new Gallery(galleryElement);
const template = document.querySelector("#card-catalog") as HTMLTemplateElement;

// Слушаем изменение каталога
events.on("products:changed", () => {
  const items = productsModel.getItems();

  const cards = items.map((product) => {
    const cardNode = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const card = new CardCatalog(cardNode, events);

    return card.render({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      category: product.category,
    });
  });

  gallery.items = cards;
});

/**
 * =========================
 * Modal
 * =========================
 */
const modalElement = document.querySelector("#modal-container") as HTMLElement;
const modal = new Modal(modalElement, events);

/**
 * =========================
 * Обработка событий (Presenter)
 * =========================
 */

// Выбор карточки товара
events.on("card:select", (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);

  if (product) {
    productsModel.setSelected(product);
  }
});

// Когда выбран товар для просмотра (открытие превью в модалке)
events.on("product:selected", () => {
  const selected = productsModel.getSelected();
  if (!selected) return;

  const previewTemplate = document.querySelector(
    "#card-preview",
  ) as HTMLTemplateElement;

  const previewNode = previewTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;

  const cardPreview = new CardPreview(previewNode, events);

  const renderedPreview = cardPreview.render({
    id: selected.id,
    title: selected.title,
    description: selected.description,
    image: selected.image,
    price: selected.price,
    category: selected.category,
  });

  cardPreview.inBasket = basketModel.hasItem(selected.id);
  modal.content = renderedPreview;
  modal.open();
});

// Добавление товара в корзину
events.on("basket:add", (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);

  if (product) {
    basketModel.addItem(product);
  }

  modal.close();
});

// Удаление товара из корзины
events.on("basket:remove", (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);

  if (product) {
    basketModel.removeItem(product);
  }

  modal.close();
});

// Обновление счетчика корзины в шапке
events.on("basket:changed", () => {
  const counter = document.querySelector(
    ".header__basket-counter",
  ) as HTMLElement;

  if (counter) {
    counter.textContent = basketModel.getCount().toString();
  }
});

/**
 * =========================
 * Открытие корзины (без генерации событий в Presenter)
 * =========================
 */
const basketButton = document.querySelector(
  ".header__basket",
) as HTMLButtonElement;

let basketView: Basket | null = null;

const openBasket = () => {
  const basketTemplate = document.querySelector(
    "#basket",
  ) as HTMLTemplateElement;
  const basketNode = basketTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLDivElement;

  basketView = new Basket(basketNode, events, basketModel);

  modal.content = basketView.render();
  modal.open();
};

basketButton?.addEventListener("click", openBasket);

// Обновление данных покупателя
events.on("buyer:update", (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
});

// Открытие формы заказа
events.on("order:open", () => {
  const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
  const orderNode = orderTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLFormElement;

  const form = new OrderForm(orderNode, events);
  const buyer = buyerModel.getData();

  modal.content = form.render({
    payment: buyer.payment as unknown as TPayment | "",
    address: buyer.address ?? "",
  });
  modal.open();
});

events.on("order:submit", () => {
  const errors = buyerModel.validate();

  // Проверяем только payment + address
  const step1Errors: string[] = [];
  if (errors.payment) step1Errors.push(errors.payment);
  if (errors.address) step1Errors.push(errors.address);

  if (step1Errors.length > 0) {
    events.emit("order:open");
    return;
  }

  const contactsTemplate = document.querySelector(
    "#contacts",
  ) as HTMLTemplateElement;
  const contactsNode = contactsTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLFormElement;

  const form = new ContactsForm(contactsNode, events);
  const buyer = buyerModel.getData();

  modal.content = form.render({
    email: buyer.email ?? "",
    phone: buyer.phone ?? "",
  });
  modal.open();
});

events.on("contacts:submit", () => {
  const errors = buyerModel.validate();

  const step2Errors: string[] = [];
  if (errors.email) step2Errors.push(errors.email);
  if (errors.phone) step2Errors.push(errors.phone);

  if (step2Errors.length > 0) {
    events.emit("order:submit");
    return;
  }

  const buyer = buyerModel.getData();
  const items = basketModel.getItems();
  const total = basketModel.getTotal();

  const order: IOrder = {
    ...buyer,
    items: items.map((i) => i.id),
    total,
  };

  larekApi
    .postOrder(order)
    .then((result: unknown) => {
      const successTemplate = document.querySelector(
        "#success",
      ) as HTMLTemplateElement;

      const successNode = successTemplate.content.firstElementChild!.cloneNode(
        true,
      ) as HTMLElement;

      const success = new Success(successNode, events);

      let responseTotal = total;

      if (
        typeof result === "object" &&
        result !== null &&
        "total" in result &&
        typeof (result as Record<string, unknown>).total === "number"
      ) {
        responseTotal = (result as TOrderResponse).total;
      }

      modal.content = success.render({ total: responseTotal });
      modal.open();

      basketModel.clear();
      buyerModel.clear();
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

events.on("success:close", () => {
  modal.close();
});
