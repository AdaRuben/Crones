const app = require('./app');
const { GigaChat } = require('gigachat');
const { Agent } = require('node:https');
require('dotenv').config();

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const client = new GigaChat({
  timeout: 3000,
  model: 'GigaChat-Pro',
  credentials: process.env.GIGACHAT_API_KEY,
  httpsAgent,
});

const SYSTEM_PROMPT = `Ты — агент, который рассчитывает стоимость услуги эвакуатора.

Правила расчёта:
- За выезд всегда суммируется 4000 рублей.
- Передаются данные: дистанция (может быть строкой вида "12 км 300 м") и тип авто.
- Типы авто:
  - "Седан/Кроссовер" (также трактуй "Седан" и "Кроссовер" как "Седан/Кроссовер")
  - "Внедорожник"

Тарифы:
- Для "Седан/Кроссовер":
  - До 15 км — 3500 рублей.
  - Свыше 15 км — 3000 рублей + 500 рублей за каждый километр сверх 15 км.
- Для "Внедорожник":
  - До 15 км — 4000 рублей.
  - Свыше 15 км — 3500 рублей + 550 рублей за каждый километр сверх 15 км.

Интерпретация входных данных:
- Если дистанция передана строкой (например, "12 км 300 м"), преобразуй её в километры и используй для расчёта.
- Округление километржа для расчёта выполни по здравому смыслу (например, 12 км 300 м ≈ 12 км, а 12 км 600 м ≈ 13 км).

Верни ответ строго в формате:
"Стоимость услуги: Х рублей."
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Сообщение нет' });
    }

    const response = await client.chat({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
    });

    const aiResponse =
      response.choices?.[0]?.message?.content || 'Ошибка генерации ответа';
    res.json(aiResponse);
  } catch (error) {
    console.error('Детальная ошибка:', error);
    return res.status(500).json({
      error: 'Ошибка сервера при обработке запроса',
      details: error.message,
    });
  }
});
