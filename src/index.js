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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Зелёный слоник - Тюремная камера</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #1a1a1a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: 'Courier New', monospace;
            color: #fff;
        }
        
        .prison-cell {
            position: relative;
            width: 100vw;
            height: 100vh;
            background: 
                linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
                linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
                linear-gradient(-45deg, transparent 75%, #2a2a2a 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            background-color: #1a1a1a;
        }
        
        .character {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 3px solid #444;
        }
        
        .character:hover {
            transform: scale(1.1);
            border-color: #666;
        }
        
        .bratishka {
            left: 10%;
            top: 50%;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #8B4513, #A0522D);
            color: #fff;
        }
        
        .pahom {
            right: 10%;
            top: 50%;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #2F4F4F, #556B2F);
            color: #fff;
        }
        
        .action-buttons {
            position: absolute;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .bratishka-buttons {
            left: 15%;
            top: 70%;
        }
        
        .pahom-buttons {
            right: 15%;
            top: 70%;
        }
        
        .action-btn {
            background: #333;
            color: #fff;
            border: 2px solid #555;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 10px;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .action-btn:hover {
            background: #555;
            border-color: #777;
        }
        
        .dialogue-box {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px 20px;
            border-radius: 10px;
            border: 2px solid #444;
            max-width: 80%;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .title {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            z-index: 10;
        }
        
        .bars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                #333 40px,
                #333 45px
            );
            pointer-events: none;
            z-index: 1;
        }
    </style>
</head>
<body>
    <div class="prison-cell">
        <div class="bars"></div>
        <div class="title">ЗЕЛЁНЫЙ СЛОНИК - ТЮРЕМНАЯ КАМЕРА</div>
        
        <div class="character bratishka" onclick="showDialogue('bratishka')">
            БРАТИШКА<br>на шконке
        </div>
        
        <div class="character pahom" onclick="showDialogue('pahom')">
            ПАХОМ<br>в центре
        </div>
        
        <div class="action-buttons bratishka-buttons">
            <button class="action-btn" onclick="performAction('bratishka', 'stand')">Постоять как цапля</button>
            <button class="action-btn" onclick="performAction('bratishka', 'story')">Рассказать историю</button>
            <button class="action-btn" onclick="performAction('bratishka', 'joke')">Сказать шутку</button>
        </div>
        
        <div class="action-buttons pahom-buttons">
            <button class="action-btn" onclick="performAction('pahom', 'pushups')">Отжаться 20 раз</button>
            <button class="action-btn" onclick="performAction('pahom', 'philosophy')">Философствовать</button>
            <button class="action-btn" onclick="performAction('pahom', 'dance')">Станцевать</button>
        </div>
        
        <div class="dialogue-box" id="dialogueBox">
            Добро пожаловать в тюремную камеру! Кликайте на персонажей или кнопки для взаимодействия.
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
            characterElement.style.transform = characterElement.style.transform.replace('scale(1)', 'scale(1.2)');
            setTimeout(() => {
                characterElement.style.transform = characterElement.style.transform.replace('scale(1.2)', 'scale(1)');
            }, 300);
        }
        
        // Автоматическая смена диалогов каждые 10 секунд
        setInterval(() => {
            const characters = ['bratishka', 'pahom'];
            const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
            showDialogue(randomCharacter);
        }, 10000);
    </script>
</body>
</html>`;