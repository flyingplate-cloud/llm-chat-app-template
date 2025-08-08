# Простое веб-приложение для Cloudflare Worker

Минимальный пример веб-приложения, работающего на Cloudflare Worker.

## Функциональность

- Красивая веб-морда с градиентным фоном
- API endpoint `/api/hello` который возвращает JSON
- Интерактивные кнопки для тестирования API
- Современный дизайн с CSS
- Страница-игра `/game` — «Волк ловит яйца» (аналог «Ну, погоди!»)

## Структура проекта

```
├── src/
│   └── index.js          # Основной код Cloudflare Worker
├── wrangler.toml         # Конфигурация Wrangler
└── README.md            # Этот файл
```

## Установка и запуск

1. Установите Wrangler CLI:
```bash
npm install -g wrangler
```

2. Войдите в свой аккаунт Cloudflare:
```bash
wrangler login
```

3. Разверните приложение:
```bash
wrangler deploy
```

4. Откройте браузер и перейдите по URL, который покажет Wrangler после деплоя.

## Локальная разработка

Для тестирования локально:

```bash
wrangler dev
```

Приложение будет доступно по адресу `http://localhost:8787`

## API Endpoints

- `GET /` - Главная страница
- `GET /api/hello` - API endpoint, возвращает JSON с сообщением и временной меткой
- `GET /game` - Игра «Волк ловит яйца»

## Технологии

- Cloudflare Workers
- Vanilla JavaScript
- HTML5 + CSS3
- Wrangler CLI