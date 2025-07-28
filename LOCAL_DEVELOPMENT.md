# 🚀 Локальная разработка и тестирование

## 📋 Предварительные требования

### 1. Установка Node.js
```bash
# Проверьте версию Node.js (нужна 18+)
node --version
npm --version
```

### 2. Установка Wrangler CLI
```bash
npm install -g wrangler
```

### 3. Авторизация в Cloudflare
```bash
wrangler login
```

## 🔧 Настройка локального окружения

### 1. Установка зависимостей
```bash
npm install
```

### 2. Локальный запуск
```bash
# Запуск в режиме разработки
npm run dev
# или
wrangler dev
```

После этого ваш API будет доступен локально по адресу:
- **Локальный API:** `http://localhost:8787/api/chat`
- **Локальный веб-интерфейс:** `http://localhost:8787`

### 3. Тестирование локального API

Создайте файл `test_local.js`:
```javascript
// Тест локального API
async function testLocalAPI() {
  const response = await fetch('http://localhost:8787/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Привет! Тест локального API.' }]
    })
  });
  
  const data = await response.json();
  console.log('Локальный API ответ:', data);
}

testLocalAPI();
```

Запустите тест:
```bash
node test_local.js
```

## 🧪 Тестирование файлов

### 1. Тестирование API
```bash
# Базовые тесты
node test_api.js

# Практические примеры
node api_example.js
```

### 2. Веб-интерфейс
```bash
# Запуск локального сервера
python3 -m http.server 8080

# Откройте в браузере:
# http://localhost:8080/web_integration.html
```

### 3. Обновление для локального тестирования

Измените URL в файлах на локальный:

**В `test_api.js`:**
```javascript
const apiUrl = 'http://localhost:8787/api/chat'; // Локальный
// const apiUrl = 'https://llm.flyingplate.cloud/api/chat'; // Продакшн
```

**В `api_example.js`:**
```javascript
constructor(baseUrl = 'http://localhost:8787/api/chat') { // Локальный
// constructor(baseUrl = 'https://llm.flyingplate.cloud/api/chat') { // Продакшн
```

**В `web_integration.html`:**
```javascript
constructor(baseUrl = 'http://localhost:8787/api/chat') { // Локальный
// constructor(baseUrl = 'https://llm.flyingplate.cloud/api/chat') { // Продакшн
```

## 🔄 Рабочий процесс разработки

### 1. Локальная разработка
```bash
# 1. Запустите локальный сервер
npm run dev

# 2. В другом терминале тестируйте
node test_api.js

# 3. Откройте веб-интерфейс
open http://localhost:8787
```

### 2. Деплой изменений
```bash
# Деплой в Cloudflare
npm run deploy
```

### 3. Тестирование продакшн версии
```bash
# Измените URL на продакшн и протестируйте
curl -X POST https://llm.flyingplate.cloud/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Тест продакшн"}]}'
```

## 🛠️ Полезные команды

```bash
# Проверка типов TypeScript
npm run check

# Запуск тестов
npm test

# Деплой
npm run deploy

# Локальная разработка
npm run dev
```

## 📁 Структура файлов для тестирования

```
├── src/index.ts              # Основной код API
├── public/index.html         # Веб-интерфейс
├── test_api.js              # Базовые тесты API
├── api_example.js           # Практические примеры
├── web_integration.html     # Веб-интерфейс для тестирования
└── LOCAL_DEVELOPMENT.md     # Эта инструкция
```

## 🚨 Возможные проблемы

### 1. Порт занят
```bash
# Проверьте, что порт 8787 свободен
lsof -i :8787
# Если занят, убейте процесс
kill -9 <PID>
```

### 2. Проблемы с авторизацией
```bash
# Переавторизуйтесь
wrangler logout
wrangler login
```

### 3. Проблемы с зависимостями
```bash
# Очистите кэш и переустановите
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Быстрый старт

```bash
# 1. Установите зависимости
npm install

# 2. Запустите локальный сервер
npm run dev

# 3. В новом терминале протестируйте
node test_api.js

# 4. Откройте веб-интерфейс
open http://localhost:8787
```

Готово! Теперь вы можете разрабатывать и тестировать локально, а затем деплоить в Cloudflare.