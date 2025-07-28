# 🔧 Ручная настройка workflow в n8n

## 📋 Пошаговая инструкция

### 1. Создание нового workflow

1. Откройте n8n: `https://n8n.flyingplate.cloud`
2. Нажмите **"Add workflow"** или **"+"**
3. Назовите workflow: **"Cloudflare LLM API Test"**

### 2. Добавление Manual Trigger

1. В поиске узлов найдите **"Manual Trigger"**
2. Перетащите его на холст
3. Оставьте настройки по умолчанию

### 3. Добавление HTTP Request Node

1. В поиске узлов найдите **"HTTP Request"**
2. Перетащите его на холст рядом с Manual Trigger
3. Соедините Manual Trigger с HTTP Request

### 4. Настройка HTTP Request Node

**Основные настройки:**
```
Method: POST
URL: https://llm.flyingplate.cloud/api/chat
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Привет! Как дела? Ответь кратко."
    }
  ]
}
```

### 5. Добавление Set Node (опционально)

1. Найдите **"Set"** node
2. Добавьте его после HTTP Request
3. Настройте для форматирования ответа:

**Set Values:**
```
ai_response = {{ $json.response }}
tokens_used = {{ $json.usage.total_tokens }}
success = true
```

### 6. Тестирование

1. Нажмите **"Execute Workflow"**
2. Проверьте результат в Manual Trigger
3. Нажмите **"Execute Node"** на HTTP Request
4. Проверьте ответ

## 🎯 Ожидаемый результат

После выполнения вы должны увидеть:

```json
{
  "response": "Привет! У меня все хорошо, спасибо! А у тебя как дела?",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 12,
    "total_tokens": 27
  },
  "tool_calls": []
}
```

## 🔄 Динамические сообщения

Для динамических сообщений используйте выражение в Body:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.message || 'Привет!' }}"
    }
  ]
}
```

## 🚨 Важные моменты

### 1. API Key не нужен
- Оставьте поле API Key пустым
- Ваш API не требует авторизации

### 2. Модель не указывается
- В n8n поле "Model" можно оставить пустым
- Модель определяется в коде вашего API

### 3. Формат сообщений
- Используйте массив `messages` с объектами `{role, content}`
- Поддерживаются роли: `user`, `assistant`, `system`

## 🎉 Готово!

Теперь ваш API полностью интегрирован с n8n и готов к использованию в автоматизации!

### Следующие шаги:
1. Создайте более сложные workflow
2. Добавьте обработку ошибок
3. Интегрируйте с другими сервисами
4. Создайте webhook для автоматического запуска