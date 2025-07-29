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
      return new Response('GIF89a', {
        headers: {
          'content-type': 'image/gif',
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
    <title>Пахом</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .pahom-gif {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }
    </style>
</head>
<body>
    <img src="/pahom.gif" alt="Пахом" class="pahom-gif">
</body>
</html>`;