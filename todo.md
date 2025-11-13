# План добавления уведомления об успешном оформлении заказа

## Цель
Заменить простые сообщения (`message`) на более информативные уведомления (`notification`) из Ant Design на странице [MainPage.tsx](client/src/pages/main-page/MainPage.tsx) для улучшения UX при оформлении заказа.

## Текущее состояние
- В файле [MainPage.tsx:154](client/src/pages/main-page/MainPage.tsx#L154) используется `message.error` для ошибки авторизации
- В файле [MainPage.tsx:171](client/src/pages/main-page/MainPage.tsx#L171) используется `message.success` для успешного заказа
- В файле [MainPage.tsx:175](client/src/pages/main-page/MainPage.tsx#L175) используется `message.error` для ошибки создания заказа
- Компонент `message` не импортирован в файле (используется без импорта)

## Задачи

### 1. Импортировать notification из Ant Design
- [ ] Добавить импорт в начало файла [MainPage.tsx](client/src/pages/main-page/MainPage.tsx):
  ```typescript
  import { notification } from 'antd';
  ```
- [ ] Разместить импорт после существующих импортов из antd (после строки 15)

### 2. Настроить контекст для notification
- [ ] Добавить `api` из notification для программного управления:
  ```typescript
  const [api, contextHolder] = notification.useNotification();
  ```
- [ ] Разместить хук в начале компонента MainPage (после строки 24)
- [ ] Добавить `{contextHolder}` в JSX разметку внутри `<div className="app">` (после строки 183)

### 3. Заменить message.error на notification (ошибка авторизации)
- [ ] В функции `handleOrderSubmit` (строка 154) заменить:
  ```typescript
  message.error('Авторизуйтесь, чтобы оформить заказ');
  ```
  на:
  ```typescript
  api.error({
    message: 'Требуется авторизация',
    description: 'Авторизуйтесь, чтобы оформить заказ',
    placement: 'topRight',
    duration: 4,
  });
  ```

### 4. Заменить message.success на notification (успешный заказ)
- [ ] В функции `handleOrderSubmit` (строка 171) заменить:
  ```typescript
  message.success('Заказ отправлен');
  ```
  на:
  ```typescript
  api.success({
    message: 'Заказ успешно оформлен!',
    description: 'Ваш заказ отправлен и скоро будет обработан. Отслеживайте статус в разделе "Мои заказы".',
    placement: 'topRight',
    duration: 5,
  });
  ```

### 5. Заменить message.error на notification (ошибка создания заказа)
- [ ] В функции `handleOrderSubmit` (строка 175) заменить:
  ```typescript
  message.error(text);
  ```
  на:
  ```typescript
  api.error({
    message: 'Ошибка при создании заказа',
    description: text,
    placement: 'topRight',
    duration: 5,
  });
  ```

### 6. Удалить неиспользуемые импорты
- [ ] Если `message` был импортирован где-то в файле, удалить этот импорт
- [ ] Проверить, что в файле нет других использований `message`

### 7. Тестирование
- [ ] Проверить отображение уведомления при успешном оформлении заказа
- [ ] Проверить отображение уведомления при ошибке (неавторизованный пользователь)
- [ ] Проверить отображение уведомления при ошибке создания заказа
- [ ] Убедиться, что уведомления появляются в правом верхнем углу
- [ ] Проверить, что уведомления автоматически закрываются через указанное время
- [ ] Убедиться, что можно закрыть уведомление вручную

## Дополнительные улучшения (опционально)

### 8. Добавить иконки в уведомления
- [ ] Можно добавить кастомные иконки для лучшей визуализации:
  ```typescript
  import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
  ```

### 9. Добавить действия в уведомления
- [ ] Для успешного заказа можно добавить кнопку "Перейти к заказам":
  ```typescript
  api.success({
    message: 'Заказ успешно оформлен!',
    description: 'Ваш заказ отправлен и скоро будет обработан.',
    placement: 'topRight',
    duration: 5,
    btn: (
      <Button type="primary" size="small" onClick={() => navigate('/orders')}>
        Мои заказы
      </Button>
    ),
  });
  ```

## Примечания
- Notification предоставляет более гибкий и информативный способ уведомления пользователей
- Параметр `placement: 'topRight'` размещает уведомления в правом верхнем углу
- Параметр `duration` определяет время отображения в секундах
- Можно использовать `description` для дополнительной информации
- Notification поддерживает до 24 позиций размещения на экране
