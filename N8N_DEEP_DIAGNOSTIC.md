# 🔍 Глубокая диагностика проблем n8n

## 🚨 Выявленные проблемы:

### 1. **Системная проблема с внешними HTTP запросами**
- ❌ **Проблема**: Все workflow с внешними API падают с ошибками
- ❌ **Причина**: Возможные ограничения сети или настройки n8n

### 2. **Проблема с Custom Function Node**
- ❌ **Проблема**: Даже Custom Function с `fetch()` не работает
- ❌ **Причина**: Возможные ограничения на выполнение внешних запросов

### 3. **Проблема с повторными выполнениями**
- ❌ **Проблема**: Первое выполнение иногда успешно, повторные всегда падают
- ❌ **Причина**: Возможные проблемы с состоянием или кэшированием

## 🔧 Возможные причины и решения:

### 1. **Ограничения сети в n8n**

**Проверьте настройки n8n:**
```bash
# В настройках n8n проверьте:
N8N_BASIC_AUTH_ACTIVE=false
N8N_BASIC_AUTH_USER=
N8N_BASIC_AUTH_PASSWORD=
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_USER_MANAGEMENT_DISABLED=true
N8N_DIAGNOSTICS_ENABLED=false
WEBHOOK_URL=http://localhost:5678/
GENERIC_TIMEZONE=UTC
```

### 2. **Проблемы с SSL/TLS**

**Добавьте переменные окружения:**
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_OPTIONS=--max-old-space-size=4096
```

### 3. **Ограничения на внешние запросы**

**Проверьте файрвол или прокси:**
```bash
# Проверьте, может ли n8n делать внешние запросы
curl -X GET "https://n8n.flyingplate.cloud/api/v1/executions" -H "X-N8N-API-KEY: YOUR_KEY"
```

### 4. **Проблемы с версией n8n**

**Возможные проблемы:**
- Устаревшая версия n8n
- Проблемы с Node.js версией
- Конфликты зависимостей

## 🔧 Пошаговые решения:

### Шаг 1: Тест базовой функциональности

**Импортируйте `n8n_basic_test.json`** - этот workflow не использует внешние API.

**Ожидаемый результат:**
```json
{
  "status": "SUCCESS",
  "message": "Тест успешен!",
  "timestamp": "2025-07-28T14:45:00.000Z",
  "random": 0.123456789
}
```

### Шаг 2: Если базовый тест работает

**Проблема в настройках сети n8n:**

1. **Проверьте настройки прокси:**
   ```bash
   # В настройках n8n добавьте:
   HTTP_PROXY=
   HTTPS_PROXY=
   NO_PROXY=localhost,127.0.0.1
   ```

2. **Проверьте файрвол:**
   ```bash
   # Убедитесь, что n8n может делать исходящие запросы
   sudo ufw status
   ```

3. **Проверьте DNS:**
   ```bash
   # Внутри контейнера n8n:
   nslookup llm.flyingplate.cloud
   ```

### Шаг 3: Если базовый тест не работает

**Проблема в самой установке n8n:**

1. **Перезапустите n8n:**
   ```bash
   docker restart n8n
   # или
   systemctl restart n8n
   ```

2. **Проверьте логи:**
   ```bash
   docker logs n8n
   # или
   journalctl -u n8n -f
   ```

3. **Обновите n8n:**
   ```bash
   docker pull n8nio/n8n:latest
   ```

### Шаг 4: Альтернативные решения

**Если ничего не помогает:**

1. **Используйте Webhook вместо HTTP Request:**
   ```json
   {
     "webhook": {
       "url": "https://llm.flyingplate.cloud/api/chat",
       "method": "POST",
       "headers": {
         "Content-Type": "application/json"
       }
     }
   }
   ```

2. **Используйте локальный прокси:**
   ```bash
   # Создайте локальный прокси для обхода ограничений
   socat TCP-LISTEN:8080,fork TCP:llm.flyingplate.cloud:443
   ```

3. **Используйте другой метод интеграции:**
   - Zapier
   - Make.com
   - IFTTT

## 🔍 Диагностические команды:

### Проверка сети из n8n:
```javascript
// В Custom Function Node
const response = await fetch('https://httpbin.org/get');
const data = await response.json();
return [{ json: data }];
```

### Проверка DNS:
```javascript
// В Custom Function Node
const dns = require('dns').promises;
const addresses = await dns.resolve4('llm.flyingplate.cloud');
return [{ json: { addresses } }];
```

### Проверка SSL:
```javascript
// В Custom Function Node
const https = require('https');
const response = await new Promise((resolve, reject) => {
  https.get('https://llm.flyingplate.cloud/api/chat', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(JSON.parse(data)));
  }).on('error', reject);
});
return [{ json: response }];
```

## 📊 Статистика ошибок:

**Из логов n8n:**
- Всего выполнений: 67
- Успешных: ~20%
- С ошибками: ~80%
- Время выполнения: 0.05-0.3 секунды
- Тип ошибок: "error" status

## 🎯 Рекомендации:

1. **Начните с `n8n_basic_test.json`** - проверьте базовую функциональность
2. **Проверьте настройки сети** n8n
3. **Обновите n8n** до последней версии
4. **Проверьте логи** на наличие ошибок
5. **Рассмотрите альтернативные решения** если проблема системная

## 🚀 Быстрое решение:

**Если ничего не помогает, используйте:**
- Локальный прокси
- Другую платформу автоматизации
- Прямое API подключение без n8n

**Главное**: Определите, работает ли базовый тест - это покажет, проблема в сети или в самой установке n8n! 🔍