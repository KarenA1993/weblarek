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
import { CardBasket } from "./components/view/CardBasket";

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
 * Models
 * =========================
 */
const productsModel = new ProductsModel(events);
const buyerModel = new BuyerModel(events);
const basketModel = new BasketModel(events);

/**
 * =========================
 * Галерея
 * =========================
 */
const galleryElement = document.querySelector(".gallery") as HTMLElement;
const gallery = new Gallery(galleryElement);
const catalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;

events.on("products:changed", () => {
  const items = productsModel.getItems();

  const cards = items.map((product) => {
    const cardNode = catalogTemplate.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const card = new CardCatalog(cardNode, () => {
      events.emit("card:select", { id: product.id });
    });

    return card.render({
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
 * Static views (создаются 1 раз)
 * =========================
 */
const previewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const previewNode = previewTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLElement;
const cardPreview = new CardPreview(previewNode, events);

const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketNode = basketTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLDivElement;
const basketView = new Basket(basketNode, events);

const basketItemTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;

const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const orderNode = orderTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLFormElement;
const orderForm = new OrderForm(orderNode, events);

const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const contactsNode = contactsTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsNode, events);

const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;
const successNode = successTemplate.content.firstElementChild!.cloneNode(
  true,
) as HTMLElement;
const success = new Success(successNode, events);

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
 * Presenter state
 * =========================
 */
let activeStep: "order" | "contacts" | null = null;

const setOrderFormState = (): void => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  const list: string[] = [];
  if (errors.payment) list.push(errors.payment);
  if (errors.address) list.push(errors.address);

  orderForm.render({
    payment: (buyer.payment as unknown as TPayment) ?? "",
    address: buyer.address ?? "",
    errors: list.join(". "),
    valid: list.length === 0,
  });
};

const setContactsFormState = (): void => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  const list: string[] = [];
  if (errors.email) list.push(errors.email);
  if (errors.phone) list.push(errors.phone);

  contactsForm.render({
    email: buyer.email ?? "",
    phone: buyer.phone ?? "",
    errors: list.join(". "),
    valid: list.length === 0,
  });
};

const setPreviewButtonState = (): void => {
  const selected = productsModel.getSelected();
  if (!selected) return;

  const available = selected.price !== null;
  const inBasket = basketModel.hasItem(selected.id);

  cardPreview.buttonDisabled = !available;
  cardPreview.buttonText = !available
    ? "Недоступно"
    : inBasket
      ? "Удалить из корзины"
      : "Купить";
};

/**
 * =========================
 * Presenter events
 * =========================
 */

// Выбор карточки товара
events.on("card:select", (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product) {
    productsModel.setSelected(product);
  }
});

// Открытие превью выбранного товара
events.on("product:selected", () => {
  const selected = productsModel.getSelected();
  if (!selected) return;

  cardPreview.render({
    title: selected.title,
    description: selected.description,
    image: selected.image,
    price: selected.price,
    category: selected.category,
  });

  setPreviewButtonState();

  modal.content = cardPreview.render();
  modal.open();
});

// Действие в превью (логика определяется по состоянию моделей)
events.on("preview:action", () => {
  const selected = productsModel.getSelected();
  if (!selected) return;

  if (basketModel.hasItem(selected.id)) {
    basketModel.removeItem(selected);
  } else {
    basketModel.addItem(selected);
  }

  modal.close();
});

// Добавление товара в корзину (для совместимости, если где-то осталось)
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

// Обновление корзины и счетчика
events.on("basket:changed", () => {
  const counter = document.querySelector(
    ".header__basket-counter",
  ) as HTMLElement;
  if (counter) {
    counter.textContent = basketModel.getCount().toString();
  }

  const items = basketModel.getItems();

  const basketItems = items.map((item, index) => {
    const node = basketItemTemplate.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLLIElement;

    const card = new CardBasket(node, () => {
      events.emit("basket:remove", { id: item.id });
    });

    return card.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });

  basketView.render({
    items: basketItems,
    total: basketModel.getTotal(),
  });

  setPreviewButtonState();
});

/**
 * =========================
 * Открытие корзины
 * =========================
 */
const basketButton = document.querySelector(
  ".header__basket",
) as HTMLButtonElement;
basketButton?.addEventListener("click", () => {
  modal.content = basketView.render();
  modal.open();
});

// Обновление данных покупателя
events.on("buyer:update", (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
});

// Перерисовка активной формы по изменениям в модели покупателя
events.on("buyer:changed", () => {
  setOrderFormState();
  setContactsFormState();
});

// Открытие формы заказа
events.on("order:open", () => {
  activeStep = "order";
  setOrderFormState();
  modal.content = orderForm.render();
  modal.open();
});

// Переход ко второй форме
events.on("order:submit", () => {
  activeStep = "contacts";
  setContactsFormState();
  modal.content = contactsForm.render();
  modal.open();
});

// Отправка заказа
events.on("contacts:submit", () => {
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
    .then((result: TOrderResponse) => {
      modal.content = success.render({ total: result.total });
      modal.open();

      basketModel.clear();
      buyerModel.clear();
      activeStep = null;
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

events.on("success:close", () => {
  modal.close();
  activeStep = null;
});

events.on("modal:close", () => {
  activeStep = null;
});
