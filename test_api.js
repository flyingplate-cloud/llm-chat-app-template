// Тест API для llm.flyingplate.cloud
async function testChatAPI() {
  const apiUrl = 'https://llm.flyingplate.cloud/api/chat';
  
  try {
    console.log('🚀 Тестируем API чата...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Привет! Скажи "API работает отлично!" и больше ничего не пиши.' }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Ответ от API:');
    console.log('📝 Текст:', data.response);
    console.log('🔧 Tool calls:', data.tool_calls);
    console.log('📊 Usage:', data.usage);
    
    return data;
  } catch (error) {
    console.error('❌ Ошибка при обращении к API:', error);
    throw error;
  }
}

// Тест с несколькими сообщениями
async function testConversation() {
  const apiUrl = 'https://llm.flyingplate.cloud/api/chat';
  
  try {
    console.log('\n🔄 Тестируем диалог...');
    
    // Первое сообщение
    const response1 = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Меня зовут Алексей. Запомни это.' }
        ]
      })
    });

    const data1 = await response1.json();
    console.log('👤 Первый ответ:', data1.response);

    // Второе сообщение (продолжение диалога)
    const response2 = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Меня зовут Алексей. Запомни это.' },
          { role: 'assistant', content: data1.response },
          { role: 'user', content: 'Как меня зовут?' }
        ]
      })
    });

    const data2 = await response2.json();
    console.log('🤖 Второй ответ:', data2.response);
    
    return { data1, data2 };
  } catch (error) {
    console.error('❌ Ошибка в диалоге:', error);
    throw error;
  }
}

// Запуск тестов
async function runTests() {
  try {
    await testChatAPI();
    await testConversation();
    console.log('\n🎉 Все тесты прошли успешно!');
  } catch (error) {
    console.error('\n💥 Тесты провалились:', error);
  }
}

// Запускаем тесты
runTests();