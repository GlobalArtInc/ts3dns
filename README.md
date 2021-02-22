## nodejs-tsdns
Node.js TSDNS server с RestFull API

## Авторизация
Для авторизации, нужно добавить заголовок<br />
> **Authorization: токен**

# Использование
**Список DNS зон**<br />
```http
GET http://localhost:3000/
```

**Добавить DNS зону**<br />
```http
POST http://localhost:3000/
```
**Заголовки:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `zone` | `string` | **Required**. Домен |
| `target` | `string` | **Required**. IP-адрес сервера |

**Получить зону**<br />
```http
GET http://localhost:3000/<id>
```

**Редактировать зону**<br />
```http
PUT http://localhost:3000/<id>
```
**Заголовки:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `zone` | `string` | **Required**. Домен |
| `target` | `string` | **Required**. IP-адрес сервера |

**Удалить зону**<br />
```http
DELETE http://localhost:3000/<id>
```
