# План реализации OrderHistoryPage

## Цель
Создать страницу истории заказов клиента с отображением списка заказов и возможностью взаимодействия с ними.

## Структура данных Order
```typescript
{
  id: number;
  customerId: number;
  driverId: number | null;
  from: string;
  to: string;
  totalCost: number | null;
  status: 'new' | 'in process' | 'finished' | 'cancelled';
  isPaid: boolean | null;
  vehicle: 'Кроссовер' | 'Седан' |'Внедорожник';
  customerComment?: string;
  adminComment?: string;
  finishedAt?: Date;
}
```

## Этапы реализации

### 1. Подключение Redux и загрузка данных
- [ ] Импортировать хуки `useAppDispatch` и `useAppSelector`
- [ ] Импортировать thunk `fetchAllOrders` из `@/entities/orders/model/thunks`
- [ ] Вызвать `fetchAllOrders` в `useEffect` при монтировании компонента
- [ ] Получить массив заказов из Redux store: `state.orders.orders`
- [ ] Получить статус ошибки: `state.orders.error`

### 2. Верстка компонента с использованием Ant Design
- [ ] Импортировать компоненты из `antd`:
  - `List` - для отображения списка заказов
  - `Card` - для карточки заказа
  - `Tag` - для статуса заказа
  - `Typography` - для текстовых элементов
  - `Space` - для компоновки элементов
  - `Spin` - для индикатора загрузки
  - `Empty` - для пустого состояния
  - `Alert` - для отображения ошибок

### 3. Создание карточки заказа
Каждая карточка должна отображать:
- [ ] ID заказа
- [ ] Маршрут: `from` → `to`
- [ ] Тип транспорта: `vehicle` (Кроссовер/Седан)
- [ ] Статус заказа: `status` с цветовой индикацией через `Tag`
  - `new` - синий (`blue`)
  - `in process` - оранжевый (`orange`)
  - `finished` - зеленый (`green`)
  - `cancelled` - красный (`red`)
- [ ] Стоимость: `totalCost` (если есть)
- [ ] Статус оплаты: `isPaid` (если есть)
- [ ] Комментарий клиента: `customerComment` (если есть)
- [ ] Дата завершения: `finishedAt` (если есть)

### 4. Функционал взаимодействия
- [ ] Кнопка "Отменить заказ" для заказов со статусом `new` или `in process`
  - Использовать thunk `cancelOrder`
  - Подтверждение действия через `Modal.confirm`
- [ ] Возможность редактирования/добавления комментария клиента
  - Использовать thunk `updateCustomerComment`
  - Input или TextArea для ввода
- [ ] Фильтрация заказов по статусу (опционально)
  - Использовать `Select` или `Radio.Group`

### 5. Обработка состояний
- [ ] Loading state - показать `Spin` во время загрузки
- [ ] Empty state - показать `Empty` если заказов нет
- [ ] Error state - показать `Alert` при ошибке загрузки

### 6. Стилизация
- [ ] Создать файл стилей `OrderHistoryPage.css`
- [ ] Адаптивная верстка для мобильных устройств
- [ ] Соблюдение цветовой схемы приложения (темная тема)
- [ ] Анимации переходов (опционально)

### 7. Сортировка и группировка
- [ ] Сортировка по дате (новые сначала)
- [ ] Группировка по статусам (опционально)

## Примерная структура компонента

```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/api/hooks';
import { fetchAllOrders } from '@/entities/orders/model/thunks';
import { List, Card, Tag, Typography, Space, Spin, Empty, Alert } from 'antd';

export default function OrderHistoryPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const error = useAppSelector((state) => state.orders.error);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchAllOrders()).finally(() => setLoading(false));
  }, [dispatch]);

  // Рендер состояний (loading, error, empty)
  // Рендер списка заказов
  // Функции для взаимодействия
}
```

## Компоненты для извлечения (опционально)
- `OrderCard` - карточка отдельного заказа
- `OrderStatusTag` - тег статуса с цветовой индикацией
- `OrderFilters` - компонент фильтрации заказов
