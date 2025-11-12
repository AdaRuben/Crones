const app = require('./app');
const { GigaChat } = require('gigachat');
const { Agent } = require('node:https');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const httpsAgent = new Agent({
  rejectUnauthorized: false, 
});

const client = new GigaChat({
  timeout: 600,
  model: 'GigaChat-Pro',
  credentials: process.env.GIGACHAT_API_KEY,
  httpsAgent,
});

// const getDistance = async () => {
//   try {
    
//     });
//     return
//   } catch (error) {
    
    
//     return 'Информация о картах недоступна';
//   }
// };

const SYSTEM_PROMPT = `Ты — агент, который рассчитывает стоимость услуги эвакуатора. У тебя есть следующие правила расчёта:

За выезд всегда 4000 рублей.

Передаются данные: километраж перевозки (целое число) и тип автомобиля (седан/кроссовер или внедорожник).

Для седана или кроссовера:

До 15 км — 3500 рублей.

Свыше 15 км — 3000 рублей + 50 рублей за каждый километр сверх 15 км.

Для внедорожника:

До 15 км — 4000 рублей.

Свыше 15 км — 3500 рублей + 55 рублей за каждый километр сверх 15 км.

Тебе нужно рассчитать итоговую стоимость, сложив 4000 рублей за выезд и соответствующую сумму в зависимости от километража и типа автомобиля.

Выведи ответ в формате:
"Стоимость услуги: Х рублей."
`;


app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Сообщение нет' });
    }

    console.log('Отправка запроса к GigaChat:', message);

    const currentCards = await getDistance();
    
    const dynamicSystemPrompt = `${SYSTEM_PROMPT.replace('${getCurrentCards()}', '')}

## АКТУАЛЬНЫЙ АССОРТИМЕНТ
В наличии следующие карты: ${currentCards}`;

    const response = await client.chat({
      messages: [
        { role: 'system', content: dynamicSystemPrompt },
        { role: 'user', content: message },
      ],
    });

    const aiResponse = response.choices[0]?.message.content || 'Ошибка генерации ответа';

    res.json(aiResponse);
  } catch (error) {
    console.error('Детальная ошибка:', error); 
    console.error('Стек ошибки:', error.stack);
    return res.status(500).json({ 
      error: 'Ошибка сервера при обработке запроса',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log('Server has started on port', PORT);
});
