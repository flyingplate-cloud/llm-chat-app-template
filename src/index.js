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
    <title>Простое веб-приложение</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
        }
        
        .animated-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
            animation: bgAnimation 20s ease-in-out infinite;
        }
        
        @keyframes bgAnimation {
            0%, 100% {
                transform: scale(1) rotate(0deg);
                opacity: 0.8;
            }
            25% {
                transform: scale(1.1) rotate(90deg);
                opacity: 1;
            }
            50% {
                transform: scale(0.9) rotate(180deg);
                opacity: 0.6;
            }
            75% {
                transform: scale(1.05) rotate(270deg);
                opacity: 0.9;
            }
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .button {
            background: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 8px;
            transition: background 0.3s;
        }
        .button:hover {
            background: #45a049;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="animated-bg"></div>
    <div class="container">
        <h1>🚀 Простое веб-приложение</h1>
        <p>Это минимальный пример веб-приложения, работающего на Cloudflare Worker.</p>
        
        <button class="button" onclick="callAPI()">Вызвать API</button>
        <button class="button" onclick="clearResult()">Очистить</button>
        
        <div id="result" class="result" style="display: none;"></div>
    </div>

    <script>
        async function callAPI() {
            try {
                const response = await fetch('/api/hello');
                const data = await response.json();
                
                const resultDiv = document.getElementById('result');
                resultDiv.textContent = JSON.stringify(data, null, 2);
                resultDiv.style.display = 'block';
            } catch (error) {
                const resultDiv = document.getElementById('result');
                resultDiv.textContent = 'Ошибка: ' + error.message;
                resultDiv.style.display = 'block';
            }
        }
        
        function clearResult() {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'none';
        }
    </script>
</body>
</html>`;