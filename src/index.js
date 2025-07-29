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
            background: #0a0a0a;
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
                radial-gradient(2px 2px at 20px 30px, #eee, transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                radial-gradient(2px 2px at 160px 30px, #ddd, transparent),
                radial-gradient(2px 2px at 200px 60px, rgba(255,255,255,0.4), transparent),
                radial-gradient(1px 1px at 250px 20px, #fff, transparent),
                radial-gradient(1px 1px at 280px 70px, rgba(255,255,255,0.8), transparent),
                radial-gradient(2px 2px at 320px 40px, #eee, transparent),
                radial-gradient(2px 2px at 350px 80px, rgba(255,255,255,0.6), transparent),
                radial-gradient(1px 1px at 400px 30px, #fff, transparent),
                radial-gradient(1px 1px at 430px 60px, rgba(255,255,255,0.4), transparent),
                radial-gradient(2px 2px at 470px 20px, #ddd, transparent),
                radial-gradient(2px 2px at 500px 70px, rgba(255,255,255,0.8), transparent),
                radial-gradient(1px 1px at 550px 40px, #fff, transparent),
                radial-gradient(1px 1px at 580px 80px, rgba(255,255,255,0.6), transparent),
                radial-gradient(2px 2px at 620px 30px, #eee, transparent),
                radial-gradient(2px 2px at 650px 60px, rgba(255,255,255,0.4), transparent),
                radial-gradient(1px 1px at 700px 20px, #fff, transparent),
                radial-gradient(1px 1px at 730px 70px, rgba(255,255,255,0.8), transparent),
                radial-gradient(2px 2px at 770px 40px, #ddd, transparent),
                radial-gradient(2px 2px at 800px 80px, rgba(255,255,255,0.6), transparent),
                linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            animation: spaceAnimation 30s linear infinite;
        }
        
        @keyframes spaceAnimation {
            0% {
                transform: translateY(0px) rotate(0deg);
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
            }
        }
        
        .nebula {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            background: 
                radial-gradient(ellipse at 20% 30%, rgba(120, 0, 255, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(0, 150, 255, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 40% 80%, rgba(255, 0, 150, 0.3) 0%, transparent 50%);
            animation: nebulaAnimation 25s ease-in-out infinite;
        }
        
        @keyframes nebulaAnimation {
            0%, 100% {
                transform: scale(1) rotate(0deg);
                opacity: 0.6;
            }
            33% {
                transform: scale(1.2) rotate(120deg);
                opacity: 0.8;
            }
            66% {
                transform: scale(0.8) rotate(240deg);
                opacity: 0.4;
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
    <div class="nebula"></div>
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