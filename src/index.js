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
    
    // Страница с игрой "Волк ловит яйца"
    if (url.pathname === '/game') {
      return new Response(gameHtml, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
          'cache-control': 'public, max-age=60'
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
            background: 
                linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
                linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
                linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
            background-size: 40px 40px;
            background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
            background-color: #0a0a0a;
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

const gameHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Волк ловит яйца — Ну, погоди!</title>
  <style>
    :root {
      --bg: #0b0f12;
      --lcd: #d9f0c1;
      --lcd-dim: #b9d7a3;
      --primary: #2bd1ff;
      --accent: #ffce2e;
      --danger: #ff6464;
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      background: radial-gradient(1200px 800px at 50% -10%, #12202a, var(--bg));
      color: #fff;
      display: grid;
      place-items: center;
    }

    .frame {
      width: min(92vw, 760px);
      aspect-ratio: 16/10;
      background: linear-gradient(180deg, #e8ecef, #c7cdd2);
      border-radius: 18px;
      padding: 14px;
      box-shadow: 0 12px 30px rgba(0,0,0,.35), inset 0 5px 12px rgba(255,255,255,.5), inset 0 -5px 12px rgba(0,0,0,.08);
      position: relative;
    }

    .bezel {
      height: 100%;
      border-radius: 12px;
      background: linear-gradient(180deg, #b8c1c8, #9aa3aa);
      padding: 10px;
      box-shadow: inset 0 8px 16px rgba(0,0,0,.15), inset 0 -6px 10px rgba(255,255,255,.25);
      position: relative;
    }

    .lcd {
      height: 100%;
      border-radius: 10px;
      background: repeating-linear-gradient(180deg, var(--lcd), var(--lcd) 3px, var(--lcd-dim) 3px, var(--lcd-dim) 4px);
      box-shadow: inset 0 2px 0 rgba(255,255,255,.5), inset 0 -2px 0 rgba(0,0,0,.05);
      position: relative;
      overflow: hidden;
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 6px;
    }

    .top-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; color: #1f3820; }
    .brand { font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
    .status { font-variant-numeric: tabular-nums; }

    canvas { width: 100%; height: 100%; display: block; }
    .hud { position: absolute; inset: 0; pointer-events: none; }
    .hud-inner { position: absolute; top: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; color: #1f3820; font-weight: 700; }

    .controls {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 8px;
      padding: 8px 10px 10px;
      color: #1f3820;
      user-select: none;
    }

    .btn {
      pointer-events: auto;
      background: #e7ebef;
      border: 2px solid #9aa3aa;
      border-bottom-width: 5px;
      border-radius: 10px;
      padding: 8px 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .06em;
      cursor: pointer;
      transition: transform .05s ease, border-bottom-width .05s ease;
    }
    .btn:active { transform: translateY(2px); border-bottom-width: 3px; }

    .dpad { display: grid; grid-template-columns: repeat(3, 44px); grid-template-rows: repeat(3, 44px); gap: 6px; justify-content: center; }
    .d { display: grid; place-items: center; }

    .pill { padding: 10px 14px; }

    .legend { text-align: center; color: #1f3820; font-size: 12px; padding: 0 10px 6px; opacity: .9; }

    @media (max-width: 480px) {
      .btn { font-size: 12px; padding: 8px 10px; }
      .dpad { grid-template-columns: repeat(3, 40px); grid-template-rows: repeat(3, 40px); }
    }
  </style>
</head>
<body>
  <div class="frame">
    <div class="bezel">
      <div class="lcd">
        <div class="top-bar">
          <div class="brand">Электроника</div>
          <div class="status" id="status">000000 | ❤❤❤</div>
        </div>
        <div style="position: relative; flex: 1;">
          <canvas id="game" width="720" height="460" aria-label="Волк ловит яйца"></canvas>
          <div class="hud">
            <div class="hud-inner">
              <div>Счёт</div>
              <div>Жизни</div>
            </div>
          </div>
        </div>
        <div class="controls">
          <div class="dpad">
            <div></div>
            <button class="btn d" id="up" aria-label="Вверх">↑</button>
            <div></div>
            <button class="btn d" id="left" aria-label="Влево">←</button>
            <div></div>
            <button class="btn d" id="right" aria-label="Вправо">→</button>
            <div></div>
            <button class="btn d" id="down" aria-label="Вниз">↓</button>
            <div></div>
          </div>
          <button class="btn pill" id="pause">Пауза</button>
          <button class="btn pill" id="reset">Сброс</button>
        </div>
        <div class="legend">Управление: стрелки или WASD. Цель: поймать как можно больше яиц. Сложность растёт со счётом.</div>
      </div>
    </div>
  </div>

  <script>
    (function() {
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      // Четыре лотка (лево-верх, лево-низ, право-верх, право-низ)
      const LANES = [
        { name: 'LT', start: { x: 120, y: 90 },   end: { x: 270, y: 260 } },
        { name: 'LB', start: { x: 160, y: 200 },  end: { x: 270, y: 320 } },
        { name: 'RT', start: { x: 600, y: 90 },   end: { x: 450, y: 260 } },
        { name: 'RB', start: { x: 560, y: 200 },  end: { x: 450, y: 320 } },
      ];

      const WOLF_POSITIONS = {
        LT: 0, LB: 1, RT: 2, RB: 3
      };

      let wolfPos = WOLF_POSITIONS.LB;
      let score = 0;
      let lives = 3;
      let paused = false;
      let gameOver = false;

      const eggs = []; // { lane: 0..3, t: 0..1, speed }
      let lastSpawn = 0;

      function difficulty() {
        // Ускорение спавна и скорости в зависимости от счёта
        const spawnEvery = Math.max(450, 1200 - score * 8); // мс
        const baseSpeed = 0.007 + Math.min(0.018, score * 0.00025);
        return { spawnEvery, baseSpeed };
      }

      function spawnEgg(now) {
        const { spawnEvery, baseSpeed } = difficulty();
        if (now - lastSpawn < spawnEvery) return;
        lastSpawn = now;
        const lane = Math.floor(Math.random() * 4);
        eggs.push({ lane, t: 0, speed: baseSpeed * (0.9 + Math.random() * 0.3) });
      }

      function update(dt) {
        if (paused || gameOver) return;
        for (let i = eggs.length - 1; i >= 0; i--) {
          const e = eggs[i];
          e.t += e.speed * dt;

          if (e.t >= 1) {
            // Проверяем ловлю
            if (e.lane === wolfPos) {
              score += 1;
              eggs.splice(i, 1);
            } else {
              lives -= 1;
              eggs.splice(i, 1);
              screenFlash(220, 20, 20);
              if (lives <= 0) {
                gameOver = true;
                paused = true;
              }
            }
          }
        }
      }

      function linePoint(a, b, t) {
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      }

      let flashAlpha = 0;
      let flashColor = 'rgba(0,0,0,0)';
      function screenFlash(r, g, b) {
        flashAlpha = 0.6;
        flashColor = `rgba(${r}, ${g}, ${b}, `; // will append alpha
      }

      function drawBackground() {
        // Статичная стилизация лотков
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.save();
        ctx.strokeStyle = 'rgba(30,50,32,.9)';
        ctx.fillStyle = 'rgba(30,50,32,.15)';
        ctx.lineWidth = 6;

        for (const lane of LANES) {
          ctx.beginPath();
          ctx.moveTo(lane.start.x, lane.start.y);
          ctx.lineTo(lane.end.x, lane.end.y);
          ctx.stroke();
        }

        // Кусты/декор
        function bush(x, y, s) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(30,50,32,.2)';
          ctx.arc(x, y, 24 * s, 0, Math.PI * 2);
          ctx.arc(x + 18 * s, y + 6 * s, 18 * s, 0, Math.PI * 2);
          ctx.arc(x - 18 * s, y + 6 * s, 18 * s, 0, Math.PI * 2);
          ctx.fill();
        }
        bush(100, 360, 1.2);
        bush(620, 360, 1.2);
        ctx.restore();
      }

      function drawWolf() {
        // Примитивный серый волк в 4 позах
        const hand = (x, y, mirror=false) => {
          ctx.save();
          ctx.translate(x, y);
          if (mirror) ctx.scale(-1, 1);
          ctx.fillStyle = '#777';
          ctx.strokeStyle = '#444';
          ctx.lineWidth = 2;
          // рука
          ctx.beginPath();
          ctx.roundRect(0, -10, 70, 20, 10);
          ctx.fill();
          ctx.stroke();
          // лапа
          ctx.beginPath();
          ctx.arc(72, 0, 14, 0, Math.PI * 2);
          ctx.fillStyle = '#888';
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };

        const body = (cx, cy, mirror=false) => {
          ctx.save();
          ctx.translate(cx, cy);
          if (mirror) ctx.scale(-1, 1);
          // туловище
          ctx.fillStyle = '#6f6f6f';
          ctx.strokeStyle = '#3c3c3c';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-28, -40, 56, 80, 12);
          ctx.fill();
          ctx.stroke();
          // голова
          ctx.beginPath();
          ctx.roundRect(-22, -78, 44, 36, 10);
          ctx.fill();
          ctx.stroke();
          // нос
          ctx.beginPath();
          ctx.arc(16, -60, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#222';
          ctx.fill();
          // ухо
          ctx.beginPath();
          ctx.moveTo(-16, -80); ctx.lineTo(-2, -68); ctx.lineTo(-24, -66); ctx.closePath();
          ctx.moveTo(8, -80); ctx.lineTo(20, -68); ctx.lineTo(0, -66); ctx.closePath();
          ctx.fillStyle = '#7a7a7a'; ctx.fill(); ctx.stroke();
          // нога
          ctx.beginPath();
          ctx.roundRect(-14, 38, 28, 40, 8);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };

        // Позиции
        // LT: корпус слева, рука вверх влево; LB: корпус слева, рука вниз влево
        // RT/RB: корпус справа, руки вправо
        switch (wolfPos) {
          case 0: // LT
            body(300, 310, false);
            hand(270, 260, false);
            break;
          case 1: // LB
            body(300, 330, false);
            hand(270, 320, false);
            break;
          case 2: // RT
            body(420, 310, true);
            hand(450, 260, true);
            break;
          case 3: // RB
            body(420, 330, true);
            hand(450, 320, true);
            break;
        }
      }

      function drawEggs() {
        ctx.save();
        for (const e of eggs) {
          const lane = LANES[e.lane];
          const p = linePoint(lane.start, lane.end, Math.min(e.t, 1));
          ctx.translate(p.x, p.y);
          ctx.rotate((e.lane < 2 ? -1 : 1) * 0.35);
          ctx.fillStyle = '#fff8d9';
          ctx.strokeStyle = '#a48e3b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.setTransform(1,0,0,1,0,0);
        }
        ctx.restore();
      }

      function drawUI() {
        const scoreStr = String(score).padStart(6, '0');
        const hearts = '❤'.repeat(Math.max(0, lives));
        document.getElementById('status').textContent = `${scoreStr} | ${hearts}`;

        if (flashAlpha > 0) {
          ctx.fillStyle = flashColor + flashAlpha + ')';
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
          flashAlpha = Math.max(0, flashAlpha - 0.02);
        }

        if (paused) {
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,.35)';
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
          ctx.fillStyle = '#123';
          ctx.strokeStyle = '#456';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.roundRect(WIDTH/2-170, HEIGHT/2-50, 340, 100, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#9fd2ff';
          ctx.font = 'bold 28px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(gameOver ? 'Игра окончена' : 'Пауза', WIDTH/2, HEIGHT/2-6);
          ctx.font = '16px system-ui, sans-serif';
          ctx.fillStyle = '#bfe6ff';
          ctx.fillText(gameOver ? 'Нажмите Сброс' : 'Нажмите Пауза для продолжения', WIDTH/2, HEIGHT/2+22);
          ctx.restore();
        }
      }

      // Ввод
      function setWolfPosByDir(dx, dy) {
        // dx: -1/0/1, dy: -1/0/1
        if (dx === -1 && dy === -1) wolfPos = WOLF_POSITIONS.LT;
        else if (dx === -1 && dy === 1) wolfPos = WOLF_POSITIONS.LB;
        else if (dx === 1 && dy === -1) wolfPos = WOLF_POSITIONS.RT;
        else if (dx === 1 && dy === 1) wolfPos = WOLF_POSITIONS.RB;
      }

      function handleKey(e, down) {
        if (down) {
          if (e.key === 'p' || e.key === 'P') { paused = !paused; return; }
          if (e.key === 'r' || e.key === 'R') { resetGame(); return; }
        }
        const k = e.key.toLowerCase();
        if (k === 'arrowup' || k === 'w') setWolfPosByDir((wolfPos%2? -1: -1), -1);
        if (k === 'arrowdown' || k === 's') setWolfPosByDir((wolfPos%2? -1: -1), 1);
        if (k === 'arrowleft' || k === 'a') { wolfPos = (wolfPos >= 2) ? wolfPos - 2 : wolfPos; }
        if (k === 'arrowright' || k === 'd') { wolfPos = (wolfPos <= 1) ? wolfPos + 2 : wolfPos; }
      }

      document.addEventListener('keydown', (e) => handleKey(e, true));

      // Кнопки UI
      const btn = (id, fn) => document.getElementById(id).addEventListener('click', fn);
      btn('pause', () => { if (!gameOver) paused = !paused; });
      btn('reset', () => resetGame());
      btn('up', () => setWolfPosByDir((wolfPos%2? -1: -1), -1));
      btn('down', () => setWolfPosByDir((wolfPos%2? -1: -1), 1));
      btn('left', () => { wolfPos = (wolfPos >= 2) ? wolfPos - 2 : wolfPos; });
      btn('right', () => { wolfPos = (wolfPos <= 1) ? wolfPos + 2 : wolfPos; });

      function resetGame() {
        eggs.length = 0;
        score = 0;
        lives = 3;
        paused = false;
        gameOver = false;
        lastSpawn = 0;
        wolfPos = WOLF_POSITIONS.LB;
      }

      // Цикл
      let lastTs = performance.now();
      function loop(now) {
        const dt = Math.min(40, now - lastTs);
        lastTs = now;
        spawnEgg(now);
        update(dt);
        drawBackground();
        drawEggs();
        drawWolf();
        drawUI();
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    })();
  </script>
</body>
</html>`;