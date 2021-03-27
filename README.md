## nodejs-tsdns
Node.js TSDNS server с RestFull API

## Установка
```shell
$ git clone https://github.com/GlobalArtLimited/ts3dns.git
$ cd ts3dns
$ yarn or npm i
$ screen -AmdS tsdnsserver node server.js
```
По-умолчанию, API-сервер будет работать на порту 3000

## Авторизация
Для авторизации, нужно добавить заголовок<br />
> **Authorization: токен** (по-умолчанию: abcdefg) <br />
Токен хранится в конфигурационном файле config.json

# Использование
**Список DNS зон**<br />
```http
GET http://localhost:3000/
```
____
**Добавить DNS зону**<br />
```http
POST http://localhost:3000/
```
**Заголовки:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `zone` | `string` | **Required**. Домен |
| `target` | `string` | **Required**. IP-адрес сервера |
____
**Получить зону**<br />
```http
GET http://localhost:3000/<id>
```
____
**Редактировать зону**<br />
```http
PUT http://localhost:3000/<id>
```
**Заголовки:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `zone` | `string` | **Required**. Домен |
| `target` | `string` | **Required**. IP-адрес сервера |
____
**Удалить зону**<br />
```http
DELETE http://localhost:3000/<id>
```
