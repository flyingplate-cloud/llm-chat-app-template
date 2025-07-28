// Практические примеры использования API llm.flyingplate.cloud

class ChatAPI {
  constructor(baseUrl = 'https://llm.flyingplate.cloud/api/chat') {
    this.baseUrl = baseUrl;
    this.conversationHistory = [];
  }

  async sendMessage(message, systemPrompt = null) {
    const messages = [...this.conversationHistory];
    
    if (systemPrompt && messages.length === 0) {
      messages.unshift({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: message });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Сохраняем историю диалога
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: data.response });
      
      return {
        response: data.response,
        usage: data.usage,
        tool_calls: data.tool_calls
      };
    } catch (error) {
      console.error('Ошибка API:', error);
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return [...this.conversationHistory];
  }
}

// Примеры использования
async function examples() {
  const chat = new ChatAPI();
  
  console.log('🤖 Примеры использования API\n');

  // 1. Простой вопрос
  console.log('1️⃣ Простой вопрос:');
  const result1 = await chat.sendMessage('Что такое JavaScript?');
  console.log('Ответ:', result1.response);
  console.log('Токены использовано:', result1.usage.total_tokens);
  console.log('---\n');

  // 2. Программирование
  console.log('2️⃣ Программирование:');
  const result2 = await chat.sendMessage(
    'Напиши функцию на JavaScript, которая находит максимальное число в массиве',
    'Ты - опытный программист. Отвечай только кодом без объяснений.'
  );
  console.log('Код:', result2.response);
  console.log('---\n');

  // 3. Диалог с контекстом
  console.log('3️⃣ Диалог с контекстом:');
  chat.clearHistory();
  await chat.sendMessage('Меня зовут Иван, я разработчик');
  await chat.sendMessage('Как меня зовут и чем я занимаюсь?');
  const result3 = await chat.sendMessage('Расскажи мне о JavaScript');
  console.log('Ответ с контекстом:', result3.response);
  console.log('---\n');

  // 4. Анализ текста
  console.log('4️⃣ Анализ текста:');
  const result4 = await chat.sendMessage(
    'Проанализируй этот текст: "JavaScript - это язык программирования, который используется для создания интерактивных веб-страниц. Он был создан в 1995 году."',
    'Ты - эксперт по анализу текста. Дай краткий анализ в 2-3 предложения.'
  );
  console.log('Анализ:', result4.response);
  console.log('---\n');

  // 5. Статистика использования
  console.log('5️⃣ Статистика использования:');
  console.log('Всего сообщений в истории:', chat.getHistory().length);
  console.log('История диалога:', chat.getHistory().map(msg => `${msg.role}: ${msg.content.substring(0, 50)}...`));
}

// Запуск примеров
examples().catch(console.error);