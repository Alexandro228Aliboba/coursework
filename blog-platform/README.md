# Блог-платформа (Node.js + Express + MySQL)

**Описание:**  
Курсовой проект: блог-платформа с регистрацией/авторизацией, WYSIWYG-редактором (Quill), CRUD-операциями для постов, загрузкой главного фото и файлов, тёмной/светлой темой и настраиваемыми цветами.

## Технологии

- **Node.js**  
  Серверная платформа на JavaScript с событийно-ориентированным неблокирующим выводом, идеально подходящая для I/O-интенсивных приложений.

- **Express.js**  
  Минималистичный и гибкий веб-фреймворк, который обеспечивает маршрутизацию, middleware и удобную работу с HTTP.

- **EJS**  
  Простая шаблонизация серверного рендеринга на JavaScript с возможностью layouts и partials.

- **Sequelize** ORM  
  Объектно-реляционная обёртка для работы с MySQL, позволяющая определять модели, связи и выполнять миграции через JS-код.

- **MySQL**  
  Реляционная база данных, надёжная и производительная для хранения пользователей, постов и файлов.

- **Passport.js (Local Strategy)**  
  Плагин для аутентификации, здесь используется локальная стратегия для логина по email/паролю.

- **bcrypt**  
  Библиотека для безопасного хеширования паролей с поддержкой соли и адаптивной сложности.

- **express-session**  
  Хранение сессий в памяти сервера (при необходимости можно подключить хранилище Redis или другой адаптер).

- **connect-flash**  
  Мелкий middleware для временных flash-сообщений (ошибки валидации, уведомления об успешных действиях).

- **Multer**  
  Middleware для обработки multipart/form-data, используется для загрузки фото и файлов на диск.

- **Helmet**  
  Набор middleware для установки безопасных HTTP-заголовков (CSP, X-Frame-Options и т. д.).

- **Quill.js**  
  WYSIWYG-редактор с расширенным API и удобным интерфейсом для форматирования текста.

- **SCSS**  
  Препроцессор CSS с вложенностью, переменными и миксинами для более структурированной стилизации.

- **Bootstrap 5**  
  Фронтенд-фреймворк для быстрого прототипирования адаптивного интерфейса (сетка, кнопки, формы и т. д.).

- **Self-signed SSL**  
  Генерация самоподписного сертификата через пакет `selfsigned` для работы по HTTPS на localhost.

## Установка и запуск

1. Скачать Node.js - (https://nodejs.org/en/?ref=website-popularity)
2. Скачать MySQL, выбрать установку всего (там будет кнопка "all") и поставить везде пароли "root" - (https://dev.mysql.com/downloads/installer/)
3. Открыть MySQL Command Line Client, войти в MySQL и вписать по очереди следующие запросы:

## Запросы MySQL

Создание БД:
CREATE DATABASE blog_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

Выбор БД:
USE blog_platform;

Создание таблиц:
CREATE TABLE Users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255),
email VARCHAR(255),
password VARCHAR(255),
theme VARCHAR(20) DEFAULT 'light',
postBg VARCHAR(20) DEFAULT '#ffffff',
postTextColor VARCHAR(20) DEFAULT '#000000'
);

CREATE TABLE Posts (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
user_id INT,
createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Files (
id INT AUTO_INCREMENT PRIMARY KEY,
filename VARCHAR(255),
path VARCHAR(255),
mime_type VARCHAR(100),
post_id INT,
user_id INT,
isMain BOOLEAN DEFAULT FALSE,
FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

4. Перенести папку с проектом на рабочий стол.
5. Открыть Командную строку и прописать по очереди следующие команды:

## Команды для CMD

Переход в папку на рабочем столе:
cd Desktop\blog-platform

Установка всех необходимых файлов:
npm install

Сборка SCSS:
npm run build:scss

Генерация постов:
npm run db:seed
npx sequelize db:seed:all

Запуск сервера:
npm run dev

## Ссылка - https://localhost:3000
