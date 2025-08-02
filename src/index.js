export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Обработка статических файлов
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(html, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      });
    }
    
    // Обработка GIF файла
    if (url.pathname === '/pahom.gif') {
      try {
        const gifResponse = await fetch('https://flyingplate.cloud/kurlyk.gif');
        const gifBuffer = await gifResponse.arrayBuffer();
        return new Response(gifBuffer, {
          headers: {
            'content-type': 'image/gif',
            'cache-control': 'public, max-age=3600',
          },
        });
      } catch (error) {
        return new Response('Error loading GIF', { status: 500 });
      }
    }
    
    // API endpoint
    if (url.pathname === '/api/hello') {
      return new Response(JSON.stringify({
        message: 'Hello from Cloudflare Worker!',
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'content-type': 'application/json',
        },
      });
    }
    
    // 404 для неизвестных маршрутов
    return new Response('Not Found', { status: 404 });
  },
};

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Зелёный слоник - Тюремная камера</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            background: #000;
            min-height: 100vh;
            max-height: 100vh;
            overflow: hidden;
            font-family: 'Courier New', monospace;
            color: #fff;
            position: fixed;
            width: 100%;
            height: 100%;
        }
        
        .prison-cell {
            position: relative;
            width: 100vw;
            height: 100vh;
            background: url('https://i.imgur.com/JK9mN2Q.jpg') no-repeat center center;
            background-size: cover;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1;
        }
        
        .content {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
        }
        
        .characters-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 600px;
            flex: 1;
            padding: 0 20px;
        }
        
        .character-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        
        .character {
            width: clamp(80px, 20vw, 120px);
            height: clamp(80px, 20vw, 120px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(10px, 2.5vw, 12px);
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 3px solid #444;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: #fff;
            font-weight: bold;
            line-height: 1.2;
            position: relative;
            overflow: hidden;
        }
        
        .character:hover {
            transform: scale(1.1);
            border-color: #666;
        }
        
        .character::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1;
        }
        
        .character-text {
            position: relative;
            z-index: 2;
            background: rgba(0, 0, 0, 0.7);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: clamp(8px, 2vw, 10px);
        }
        
        .pahom {
            background-image: url('https://avatanplus.com/files/resources/original/572a212f0727a1547c919fb5.png');
        }
        
        .bratishka {
            background-image: url('https://rytp.miraheze.org/wiki/%D0%A4%D0%B0%D0%B9%D0%BB:%D0%95%D0%BF%D0%B8%D1%84%D0%B0%D0%BD.png');
        }
        
        .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            max-width: 150px;
        }
        
        .action-btn {
            background: rgba(51, 51, 51, 0.9);
            color: #fff;
            border: 2px solid #555;
            padding: clamp(6px, 2vw, 8px) clamp(8px, 2.5vw, 12px);
            border-radius: 5px;
            cursor: pointer;
            font-size: clamp(8px, 2vw, 10px);
            transition: all 0.3s ease;
            white-space: nowrap;
            text-align: center;
            line-height: 1.2;
        }
        
        .action-btn:hover {
            background: rgba(85, 85, 85, 0.9);
            border-color: #777;
        }
        
        .dialogue-box {
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: clamp(10px, 3vw, 15px) clamp(15px, 4vw, 20px);
            border-radius: 10px;
            border: 2px solid #444;
            max-width: 90%;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: clamp(12px, 3vw, 14px);
            line-height: 1.4;
            margin-bottom: 10px;
            z-index: 10;
        }
        
        @media (max-width: 480px) {
            .characters-container {
                padding: 0 10px;
            }
            
            .action-buttons {
                max-width: 120px;
            }
        }
        
        @media (max-height: 600px) {
            .dialogue-box {
                min-height: 50px;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="prison-cell">
        <div class="overlay"></div>
        <div class="content">
            <div class="characters-container">
                <div class="character-section">
                    <div class="character pahom" onclick="showDialogue('pahom')">
                        <div class="character-text">ПАХОМ</div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="performAction('pahom', 'pushups')">Отжаться 20 раз</button>
                        <button class="action-btn" onclick="performAction('pahom', 'philosophy')">Философствовать</button>
                        <button class="action-btn" onclick="performAction('pahom', 'dance')">Станцевать</button>
                    </div>
                </div>
                
                <div class="character-section">
                    <div class="character bratishka" onclick="showDialogue('bratishka')">
                        <div class="character-text">БРАТИШКА</div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="performAction('bratishka', 'stand')">TBD</button>
                        <button class="action-btn" onclick="performAction('bratishka', 'story')">TBD</button>
                        <button class="action-btn" onclick="performAction('bratishka', 'joke')">TBD</button>
                    </div>
                </div>
            </div>
            
            <div class="dialogue-box" id="dialogueBox">
                Добро пожаловать в тюремную камеру! Кликайте на персонажей или кнопки для взаимодействия.
            </div>
        </div>
    </div>

    <script>
        const dialogues = {
            bratishka: {
                stand: "Братишка встаёт как цапля и балансирует на одной ноге. 'Смотри, Пахом, как я умею!'",
                story: "Братишка начинает рассказывать: 'Жили-были два друга в тюрьме...'",
                joke: "Братишка: 'Почему слоник зелёный? Потому что он не красный!'"
            },
            pahom: {
                pushups: "Пахом начинает отжиматься: 'Раз, два, три... двадцать! Вот это сила!'",
                philosophy: "Пахом задумчиво: 'Что есть свобода? Это состояние души, а не тела...'",
                dance: "Пахом пускается в пляс: 'Танцуй, пока можешь танцевать!'"
            }
        };
        
        const characterDialogues = {
            bratishka: [
                "Привет, Пахом! Как дела?",
                "Скучно тут, да?",
                "Хочешь, расскажу анекдот?",
                "Когда нас выпустят, братан?"
            ],
            pahom: [
                "Здорово, Братишка! Всё нормально.",
                "Да, время тянется медленно...",
                "Рассказывай, слушаю.",
                "Скоро, братан, скоро..."
            ]
        };
        
        function showDialogue(character) {
            const dialogues = characterDialogues[character];
            const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
            document.getElementById('dialogueBox').textContent = randomDialogue;
        }
        
        function performAction(character, action) {
            const dialogue = dialogues[character][action];
            document.getElementById('dialogueBox').textContent = dialogue;
            
            // Добавляем визуальный эффект
            const characterElement = document.querySelector('.' + character);
            characterElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                characterElement.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Автоматическая смена диалогов каждые 10 секунд
        setInterval(() => {
            const characters = ['bratishka', 'pahom'];
            const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
            showDialogue(randomCharacter);
        }, 10000);
        
        // Предотвращаем зум на мобильных устройствах
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    </script>
</body>
</html>`;