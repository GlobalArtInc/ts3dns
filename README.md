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

**Список DNS зон**<br />
```http
POST http://localhost:3000/
```
**Заголовки:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `zone` | `string` | **Required**. Домен |
| `target` | `string` | **Required**. IP-адрес сервера |
