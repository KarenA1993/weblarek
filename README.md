# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

---

## Данные

В приложении используются следующие типы данных:

### IProduct

Описывает товар интернет-магазина.

Поля:

- `id: string` — идентификатор товара
- `title: string` — название
- `description: string` — описание
- `image: string` — изображение
- `category: string` — категория
- `price: number | null` — цена товара

### IBuyer

Описывает данные покупателя, которые используются для отправки заказа на сервер.

> На уровне модели (`BuyerModel`) поле `payment` может временно иметь значение `''` — это используется для состояния, когда пользователь ещё не выбрал способ оплаты.  
> Перед отправкой заказа данные приводятся к типу `IBuyer`.

Поля:

- `payment: 'card' | 'cash'` — способ оплаты
- `email: string` — email покупателя
- `phone: string` — телефон
- `address: string` — адрес доставки

> На уровне форм (View) для удобства используется тип `TPayment | ""`, чтобы хранить состояние “способ оплаты ещё не выбран”.

### IOrder

Описывает заказ, отправляемый на сервер.

Поля:

- `payment: 'card' | 'cash'`
- `email: string`
- `phone: string`
- `address: string`
- `items: string[]` — массив id товаров
- `total: number` — общая сумма заказа

---

### TOrderResponse

Тип ответа сервера при оформлении заказа.

Поля:

- `total: number` — итоговая сумма в ответе сервера
- `id?: string` — идентификатор заказа (может отсутствовать)

---

## Модели данных

### ProductsModel

Отвечает за хранение каталога товаров и выбранного товара.

Поля:

- `items: IProduct[]` — массив товаров
- `selected: IProduct | null` — выбранный товар

Методы:

- `setItems(items: IProduct[]): void`
- `getItems(): IProduct[]`
- `getItemById(id: string): IProduct | undefined`
- `setSelected(item: IProduct): void`
- `getSelected(): IProduct | null`

### BasketModel

Отвечает за хранение товаров в корзине.

Поля:

- `items: IProduct[]` — товары в корзине

Методы:

- `getItems(): IProduct[]`
- `addItem(item: IProduct): void`
- `removeItem(item: IProduct): void`
- `clear(): void`
- `getTotal(): number`
- `getCount(): number`
- `hasItem(id: string): boolean`

### BuyerModel

Отвечает за хранение данных покупателя и их валидацию.

Поля:

- `payment: 'card' | 'cash' | ''`
- `email: string`
- `phone: string`
- `address: string`

Методы:

- `setData(data: Partial<IBuyer>): void`
- `getData(): IBuyer`
- `clear(): void`
- `validate(): Partial<Record<keyof IBuyer, string>>`

---

## Слой коммуникации

### LarekApi

Класс для взаимодействия с сервером.

Использует композицию с базовым классом Api.

Методы:

- `getProducts(): Promise<IProduct[]>` — получить каталог товаров
- `postOrder(order: IOrder): Promise<unknown>` — отправка заказа на сервер

---

## Слой View (Компоненты представления)

Слой View отвечает за работу с DOM: отображение данных и генерацию событий в ответ на действия пользователя. Компоненты представления не хранят бизнес-данные и не содержат бизнес-логики — данные хранятся в моделях, а логика связывания находится в Presenter (main.ts).

Ниже описаны реализованные классы View.

---

### Gallery (src/components/view/Gallery.ts)

Назначение: отображение списка карточек каталога в контейнере `<main class="gallery">`.

Конструктор:

- `constructor(container: HTMLElement)`

Поля:

- `_items: HTMLElement[]` — массив DOM-элементов карточек для рендера

Методы/сеттеры:

- `set items(items: HTMLElement[])` — сохраняет карточки и вызывает `render()`
- `render(): HTMLElement` — заменяет содержимое контейнера на переданные карточки

---

### Modal (src/components/view/Modal.ts)

Назначение: управление модальным окном, показ/скрытие, закрытие по клику на крестик и по клику на оверлей.

Конструктор:

- `constructor(container: HTMLElement, events: IEvents)`

Поля:

- `_closeButton: HTMLButtonElement` — кнопка закрытия (крестик)
- `_content: HTMLElement` — контейнер контента модального окна
- `_events: IEvents` — брокер событий

Методы/сеттеры:

- `set content(node: HTMLElement)` — заменяет содержимое `_content` на `node`
- `open(): void` — добавляет класс `modal_active`, блокирует прокрутку страницы
- `close(): void` — удаляет класс `modal_active`, очищает контент, разблокирует прокрутку, эмитит событие

События:

- `modal:close` — эмитится при закрытии модального окна

---

#### CardBase

Базовый класс для карточек товаров. Вынесен общий функционал для трёх карточек (каталог, превью, корзина), согласно требованию ТЗ.

Файл: `src/components/view/CardBase.ts`

Назначение:

- хранит `id`
- содержит общие методы форматирования цены, установки категории и картинки через CDN

Наследники:

- `CardCatalog`
- `CardPreview`
- `CardBasket`

---

#### FormBase (src/components/view/FormBase.ts)

Базовый класс для форм. Вынесен общий функционал для двух форм оформления заказа, согласно требованию ТЗ.

Назначение:

- кеширует submit-кнопку и блок ошибок;
- вешает единый обработчик `submit`;
- управляет состоянием `valid/errors`;
- генерирует событие сабмита формы (имя события задаётся в конструкторе).

Конструктор:

- `constructor(container: HTMLFormElement, events: IEvents, submitEventName: string)`

Поля:

- `_submit: HTMLButtonElement` — submit-кнопка формы
- `_errors: HTMLElement` — контейнер ошибок

Сеттеры/методы:

- `set errors(value: string)` — вывод текста ошибок
- `set valid(value: boolean)` — включает/выключает submit
- `validate(): void` — абстрактный метод валидации (реализуется в наследниках)

Наследники:

- `OrderForm`
- `ContactsForm`

---

### CardCatalog (src/components/view/CardCatalog.ts)

Назначение: отображение карточки товара в каталоге на главной странице.

Конструктор:

- `constructor(container: HTMLElement, events: IEvents)`

DOM-поля:

- `_title: HTMLElement`
- `_image: HTMLImageElement`
- `_price: HTMLElement`
- `_category: HTMLElement`

Сеттеры:

- `id: string` — сохраняется в `dataset.id`
- `title: string`
- `image: string` — устанавливает картинку через `CDN_URL`
- `price: number | null` — если `null`, выводится «Недоступно»
- `category: string` — устанавливает класс категории через `categoryMap`

События:

- `card:select` — эмитится при клике на карточку, передаёт `{ id }`

---

### CardPreview (src/components/view/CardPreview.ts)

Назначение: отображение детальной карточки товара в модальном окне.

Конструктор:

- `constructor(container: HTMLElement, events: IEvents)`

DOM-поля:

- `_image: HTMLImageElement`
- `_title: HTMLElement`
- `_category: HTMLElement`
- `_description: HTMLElement`
- `_price: HTMLElement`
- `_button: HTMLButtonElement`

Сеттеры:

- `id: string` — внутренний id товара
- `title: string`
- `description: string`
- `image: string`
- `price: number | null` — если `null`, кнопка disabled и текст «Недоступно»
- `category: string`
- `inBasket: boolean` — меняет текст кнопки «Купить» / «Удалить из корзины»

События:

- `basket:add` — эмитится при покупке товара, передаёт `{ id }`
- `basket:remove` — эмитится при удалении из корзины, передаёт `{ id }`

---

### Basket (src/components/view/Basket.ts)

Назначение: отображение корзины в модальном окне: список товаров, общая сумма, кнопка оформления.

Конструктор:

- `constructor(container: HTMLDivElement, events: IEvents, basketModel: BasketModel)`

DOM-поля:

- `_list: HTMLUListElement` — список товаров
- `_priceEl: HTMLElement` — общая сумма
- `_buttonOrder: HTMLButtonElement` — кнопка «Оформить»
- `_itemTemplate: HTMLTemplateElement` — шаблон элемента корзины `#card-basket`

Поведение:

- при изменении корзины подписывается на `basket:changed` и перерисовывается
- если корзина пустая — показывает «Корзина пуста» и делает кнопку «Оформить» disabled

Методы:

- `render(): HTMLElement`

События:

- `order:open` — эмитится при клике «Оформить»

---

### CardBasket (src/components/view/CardBasket.ts)

Назначение: отображение одной позиции товара в корзине.

Конструктор:

- `constructor(container: HTMLLIElement, events: IEvents)`

DOM-поля:

- `_index: HTMLElement`
- `_title: HTMLElement`
- `_price: HTMLElement`
- `_deleteButton: HTMLButtonElement`
- `_id: string` — id товара для удаления

Сеттеры:

- `id: string`
- `index: number`
- `title: string`
- `price: number | null`

События:

- `basket:remove` — эмитится при клике на кнопку удаления, передаёт `{ id }`

---

### OrderForm (src/components/view/OrderForm.ts)

Назначение: первый шаг оформления заказа (выбор оплаты + адрес доставки).

Родитель: `FormBase<IOrderFormData>`

Конструктор:

- `constructor(container: HTMLFormElement, events: IEvents)`

DOM-поля:

- `_buttons: HTMLButtonElement[]` — кнопки оплаты
- `_address: HTMLInputElement` — поле адреса

Поля состояния:

- `_payment: TPayment | ""` — выбранный способ оплаты

Сеттеры:

- `payment: TPayment | ""` — подсвечивает кнопку активной через `button_alt-active`
- `address: string`

События:

- `buyer:update` — эмитится при вводе данных, передаёт частичные данные покупателя
- `order:submit` — эмитится при submit формы (если форма валидна)

---

### ContactsForm (src/components/view/ContactsForm.ts)

Назначение: второй шаг оформления заказа (email + телефон).

Родитель: `FormBase<IContactsFormData>`

Конструктор:

- `constructor(container: HTMLFormElement, events: IEvents)`

DOM-поля:

- `_email: HTMLInputElement`
- `_phone: HTMLInputElement`

Сеттеры:

- `email: string`
- `phone: string`

События:

- `buyer:update` — эмитится при вводе email/phone
- `contacts:submit` — эмитится при submit формы (если форма валидна)

---

### Success (src/components/view/Success.ts)

Назначение: экран успешного оформления заказа.

Конструктор:

- `constructor(container: HTMLElement, events: IEvents)`

DOM-поля:

- `_desc: HTMLElement` — описание «Списано …»
- `_close: HTMLButtonElement` — кнопка закрытия

Сеттеры:

- `total: number` — выводит сумму списания

События:

- `success:close` — эмитится при клике «За новыми покупками!»

---

## События приложения

События моделей (Model):

- `products:changed` — каталог товаров сохранён в `ProductsModel`
- `product:selected` — выбран товар для просмотра
- `basket:changed` — изменилось содержимое корзины
- `buyer:changed` — изменились данные покупателя

События представлений (View):

- `card:select` — пользователь выбрал карточку каталога
- `basket:add` — пользователь нажал «Купить»
- `basket:remove` — пользователь удалил товар из корзины (preview или basket item)
- `basket:open` — пользователь открыл корзину (кнопка в шапке)
- `order:open` — пользователь нажал «Оформить» в корзине
- `buyer:update` — пользователь вводит данные в формах
- `order:submit` — переход ко второму шагу оформления
- `contacts:submit` — отправка заказа (оплата)
- `success:close` — закрытие экрана успешной оплаты
- `modal:close` — закрытие модального окна

---

## Presenter (src/main.ts)

Presenter реализован в `src/main.ts` и связывает Model и View.

Основные обязанности:

- запрашивает каталог через `LarekApi.getProducts()` и сохраняет его в `ProductsModel`
- по событию `products:changed` создаёт карточки каталога и передаёт их в `Gallery`
- по событию `card:select` выбирает товар в `ProductsModel`
- по событию `product:selected` открывает модальное окно с `CardPreview`
- по событиям `basket:add` / `basket:remove` изменяет `BasketModel` и закрывает модалку
- по `basket:changed` обновляет счётчик корзины в шапке
- по `basket:open` открывает модалку с компонентом `Basket`
- по `order:open` открывает форму `OrderForm`
- по `order:submit` валидирует шаг 1 и открывает `ContactsForm`
- по `contacts:submit` валидирует шаг 2, отправляет заказ через `LarekApi.postOrder()`, показывает `Success`, очищает корзину и данные покупателя
- по `success:close` закрывает модальное окно

---

## Соответствие функциональным требованиям

- Главная страница: каталог, открытие карточки, корзина, счётчик — реализовано
- Просмотр товара: детальная информация, купить/удалить, недоступный товар без цены — реализовано
- Корзина: список, удаление, сумма, кнопка оформления и её блокировка при пустой корзине — реализовано
- Оформление: два шага, валидация, отправка на сервер, success, очистка корзины и данных — реализовано
- Модальные окна: закрытие по крестику и по клику на оверлей, блокировка прокрутки — реализовано

- После успешной оплаты: выполняется отправка заказа на сервер, показывается Success-экран, корзина очищается, данные покупателя очищаются — реализовано
