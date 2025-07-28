# 🔗 Интеграция с n8n

## 🚨 Проблема

n8n ожидает стандартный формат OpenAI API, но ваш API имеет свой формат. Нужно создать адаптер.

## 🔧 Решение 1: HTTP Request Node

### 1. Настройка HTTP Request Node

В n8n создайте новый workflow и добавьте **HTTP Request** node:

**Настройки HTTP Request:**
```
Method: POST
URL: https://llm.flyingplate.cloud/api/chat
Headers:
  Content-Type: application/json
Body (JSON):
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.message }}"
    }
  ]
}
```

### 2. Пример Workflow

```json
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "url": "https://llm.flyingplate.cloud/api/chat",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "messages",
              "value": "=[{\"role\": \"user\", \"content\": \"{{ $json.message }}\"}]"
            }
          ]
        }
      },
      "id": "http-request",
      "name": "Chat API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [240, 300]
    }
  ]
}
```

## 🔧 Решение 2: Custom Function Node

### 1. Создайте Function Node

```javascript
// Custom Function для работы с вашим API
const messages = $input.all()[0].json.messages || [];
const userMessage = $input.all()[0].json.message || "Привет!";

// Формируем запрос
const requestBody = {
  messages: [
    ...messages,
    { role: "user", content: userMessage }
  ]
};

// Отправляем запрос
const response = await fetch('https://llm.flyingplate.cloud/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestBody)
});

const data = await response.json();

// Возвращаем результат
return [
  {
    json: {
      response: data.response,
      usage: data.usage,
      tool_calls: data.tool_calls,
      messages: [
        ...messages,
        { role: "user", content: userMessage },
        { role: "assistant", content: data.response }
      ]
    }
  }
];
```

## 🔧 Решение 3: Webhook + HTTP Request

### 1. Webhook Node (вход)
```
Method: POST
Path: /chat
```

### 2. HTTP Request Node (выход)
```
Method: POST
URL: https://llm.flyingplate.cloud/api/chat
Body: {{ $json }}
```

## 🎯 Рекомендуемое решение

### Используйте **HTTP Request Node** с такой конфигурацией:

**Input:**
```json
{
  "message": "Привет! Как дела?"
}
```

**HTTP Request Node:**
```
Method: POST
URL: https://llm.flyingplate.cloud/api/chat
Headers:
  Content-Type: application/json
Body:
{
  "messages": [
    {
      "role": "user", 
      "content": "{{ $json.message }}"
    }
  ]
}
```

**Output:**
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

## 🔄 Пример полного workflow

### 1. Manual Trigger
```json
{
  "message": "Расскажи мне о JavaScript"
}
```

### 2. HTTP Request Node
```json
{
  "parameters": {
    "httpMethod": "POST",
    "url": "https://llm.flyingplate.cloud/api/chat",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "messages",
          "value": "=[{\"role\": \"user\", \"content\": \"{{ $json.message }}\"}]"
        }
      ]
    }
  }
}
```

### 3. Set Node (опционально)
```json
{
  "parameters": {
    "values": {
      "string": [
        {
          "name": "ai_response",
          "value": "={{ $json.response }}"
        },
        {
          "name": "tokens_used",
          "value": "={{ $json.usage.total_tokens }}"
        }
      ]
    }
  }
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

### 4. Обработка ошибок
```javascript
// В Function Node добавьте обработку ошибок
try {
  const response = await fetch('https://llm.flyingplate.cloud/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return [{ json: data }];
} catch (error) {
  return [{
    json: {
      error: error.message,
      success: false
    }
  }];
}
```

## 🎉 Готово!

Теперь ваш API полностью интегрирован с n8n и готов к использованию в автоматизации!