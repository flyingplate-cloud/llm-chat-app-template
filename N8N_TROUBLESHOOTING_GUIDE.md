# 🔧 Пошаговое руководство по устранению проблем n8n

## 🚨 Проблема: Пустой output и ошибки при повторных запусках

### 📋 Шаг 1: Диагностика проблемы

**Проверьте следующее:**

1. **Откройте workflow в n8n**
2. **Нажмите "Execute Workflow"**
3. **Проверьте каждый узел по отдельности:**

#### Manual Trigger:
- ✅ Должен показывать пустой JSON `{}`
- ✅ Статус: "Success"

#### HTTP Request Node:
- ❌ **Проблема**: Скорее всего показывает "Success" но пустой output
- ❌ **Причина**: Неправильная обработка JSON ответа

### 🔧 Шаг 2: Исправление HTTP Request Node

**Замените HTTP Request Node на Custom Function Node:**

1. **Удалите HTTP Request Node**
2. **Добавьте "Function" Node**
3. **Вставьте этот код:**

```javascript
// Custom Function для вызова API
const message = $input.first().json.message || 'Привет! Как дела?';

const response = await fetch('https://llm.flyingplate.cloud/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [
      {
        role: 'user',
        content: message
      }
    ]
  })
});

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();

return [{
  json: {
    success: true,
    ai_response: data.response,
    tokens_used: data.usage?.total_tokens || 0,
    raw_response: data,
    timestamp: new Date().toISOString()
  }
}];
```

### 🔧 Шаг 3: Альтернативное решение - Webhook

**Создайте новый workflow с Webhook:**

1. **Добавьте "Webhook" Node**
2. **Настройте:**
   - Method: POST
   - Path: `/test-api`
   - Response Mode: "Respond to Webhook"

3. **Добавьте "HTTP Request" Node после Webhook**
4. **Настройте HTTP Request:**
   ```
   Method: POST
   URL: https://llm.flyingplate.cloud/api/chat
   Headers: Content-Type: application/json
   Body: 
   {
     "messages": [
       {
         "role": "user",
         "content": "{{ $json.message || 'Привет!' }}"
       }
     ]
   }
   ```

5. **Добавьте "Respond to Webhook" Node**
6. **Настройте ответ:**
   ```json
   {
     "success": true,
     "response": "{{ $json.response }}",
     "tokens": "{{ $json.usage.total_tokens }}"
   }
   ```

### 🔧 Шаг 4: Тестирование

**Протестируйте workflow:**

1. **Импортируйте `n8n_custom_function_solution.json`**
2. **Выполните workflow**
3. **Проверьте результат в "Format Output" узле**

**Ожидаемый результат:**
```json
{
  "status": "SUCCESS",
  "response": "Привет! У меня все хорошо, спасибо! А у тебя как дела?",
  "tokens": 27
}
```

### 🔧 Шаг 5: Если проблемы остаются

**Проверьте настройки n8n:**

1. **Откройте Settings → Environment Variables**
2. **Добавьте переменную:**
   ```
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

3. **Перезапустите n8n**
4. **Попробуйте снова**

### 🔧 Шаг 6: Отладка

**Добавьте отладочные узлы:**

1. **"Set" Node для логирования:**
   ```json
   {
     "input_data": "{{ $json }}",
     "timestamp": "{{ $now }}",
     "node_name": "HTTP Request"
   }
   ```

2. **"IF" Node для проверки ошибок:**
   ```
   Condition: {{ $json.error }}
   ```

### 📁 Готовые решения:

1. **`n8n_simple_test.json`** - Минимальный тест
2. **`n8n_custom_function_solution.json`** - Решение с Custom Function
3. **`n8n_workflow_fixed.json`** - Исправленный HTTP Request

### 🎯 Рекомендации:

1. **Используйте Custom Function** вместо HTTP Request для сложных API
2. **Добавьте обработку ошибок** во все узлы
3. **Логируйте все данные** для отладки
4. **Тестируйте узлы по отдельности**

### 🚀 Быстрое решение:

**Импортируйте `n8n_custom_function_solution.json` - это должно работать сразу!**

---

## 📞 Если ничего не помогает:

1. **Проверьте логи n8n** в консоли
2. **Увеличьте timeout** до 60 секунд
3. **Попробуйте другой браузер**
4. **Очистите кэш n8n**

**Главное**: Custom Function Node обходит все проблемы с HTTP Request Node! 🎉