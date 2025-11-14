import { Form, Input, Select, Tooltip } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import type { ActivePoint, RouteInfo, Suggestion } from '@/entities/maps/types/MapTypes';

type VehicleType = 'Кроссовер' | 'Седан' | 'Внедорожник';

export type OrderFormValues = {
  vehicle: VehicleType | null;
  comment: string;
  fromAddress: string;
  toAddress: string;
};

type OrderFormProps = {
  routeInfo: RouteInfo;
  fromAddress: string;
  toAddress: string;
  activePoint: ActivePoint;
  suggestions: Suggestion[];
  suggestVisible: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onFromFocus: () => void;
  onToFocus: () => void;
  onFromBlur: (value: string) => void;
  onToBlur: (value: string) => void;
  onFromSelect: (value: string) => void;
  onToSelect: (value: string) => void;
  onClear: () => void;
  onSubmit: (values: OrderFormValues) => void | Promise<void>;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  onVehicleChange?: (value: VehicleType | null) => void; 
  priceText?: string;
};

export default function OrderForm({
  routeInfo,
  fromAddress,
  toAddress,
  activePoint,
  suggestions,
  suggestVisible,
  onFromChange,
  onToChange,
  onFromFocus,
  onToFocus,
  onFromBlur,
  onToBlur,
  onFromSelect,
  onToSelect,
  onClear,
  onSubmit,
  isExpanded: externalIsExpanded,
  onExpandChange,
  onVehicleChange, 
  priceText,
}: OrderFormProps): React.JSX.Element | null {
  const [form] = Form.useForm<OrderFormValues>();
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const vehicleValue = Form.useWatch('vehicle', form) as VehicleType | null;

  const parseDistanceKm = (distance?: string | null): number | null => {
    if (!distance) return null;
    const kmMatch = distance.match(/(\d+(?:[.,]\d+)?)\s*км/i);
    const mMatch = distance.match(/(\d+)\s*м/i);
    let km = kmMatch ? parseFloat(kmMatch[1].replace(',', '.')) : 0;
    const meters = mMatch ? parseInt(mMatch[1], 10) : 0;
    if (!kmMatch && !mMatch) return null;
    km = meters >= 500 ? Math.ceil(km) : Math.floor(km);
    return Math.max(0, km);
  };

  const formatRub = (n: number): string => `${n.toLocaleString('ru-RU')} ₽`;

  const priceTooltip = useMemo(() => {
    if (!routeInfo) return null;
    const distanceKm = parseDistanceKm(routeInfo.distance);
    const vehicle = vehicleValue;
    if (!distanceKm || !vehicle) return null;

    const base = 4000;
    const isSUV = vehicle === 'Внедорожник';

    let tariff = 0;
    let distanceLabel = '';

    if (isSUV) {
      if (distanceKm <= 15) {
        tariff = 4000;
        distanceLabel = `Тариф до 15 км`;
      } else {
        tariff = 3500 + 550 * (distanceKm - 15);
        distanceLabel = `Стоимость за дистанцию свыше 15 км`;
      }
    } else {
      if (distanceKm <= 15) {
        tariff = 3500;
        distanceLabel = `Тариф до 15 км`;
      } else {
        tariff = 3000 + 500 * (distanceKm - 15);
        distanceLabel = `Стоимость за дистанцию свыше 15 км`;
      }
    }

    const total = base + tariff;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div>Выезд эвакуатора для {vehicle}: {formatRub(base)}</div>
        <div>{distanceLabel}: {formatRub(tariff)}</div>
        <div><strong>Итого: {formatRub(total)}</strong></div>
      </div>
    );
  }, [vehicleValue, routeInfo]);

  const isExpanded = externalIsExpanded ?? internalIsExpanded;
  const setIsExpanded = (value: boolean): void => {
    if (onExpandChange) {
      onExpandChange(value);
    } else {
      setInternalIsExpanded(value);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      fromAddress,
      toAddress,
    });
  }, [form, fromAddress, toAddress]);

  const handleFinish = async (values: OrderFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const handleClear = (): void => {
    form.resetFields();
    onClear();
    onVehicleChange?.(null);
  };

  const handleValuesChange = (changed: Partial<OrderFormValues>): void => {
    if (changed.fromAddress !== undefined) {
      onFromChange(changed.fromAddress);
    }
    if (changed.toAddress !== undefined) {
      onToChange(changed.toAddress);
    }
    if (Object.prototype.hasOwnProperty.call(changed, 'vehicle')) {
      onVehicleChange?.(changed.vehicle ?? null); 
    }
  };

  const handleDragStart = (clientY: number): void => {
    setIsDragging(true);
    startY.current = clientY;
  };

  const handleDragMove = (clientY: number): void => {
    if (!isDragging) return;
    currentY.current = clientY;
    const diff = startY.current - currentY.current;

    if (diff > 50) {
      setIsExpanded(true);
    } else if (diff < -50) {
      setIsExpanded(false);
    }
  };

  const handleDragEnd = (): void => {
    setIsDragging(false);
  };

  const handleToggle = (): void => {
    setIsExpanded(!isExpanded);
  };

  const handleTouchStart = (e: React.TouchEvent): void => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = (): void => {
    handleDragEnd();
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    handleDragStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    handleDragMove(e.clientY);
  };

  const handleMouseUp = (): void => {
    handleDragEnd();
  };

  return (
    <section
      className={`bottom-sheet ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="drag-handle"
        onClick={handleToggle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <header>
        <div className="title">Вызов эвакуатора</div>
        {routeInfo && (
          <div className="route-info">
            <span>{routeInfo.distance}</span>
            <span>•</span>
            <span>{routeInfo.time}</span>
          </div>
        )}
         {priceText && (
          <Tooltip title={priceTooltip} placement="top">
            <div className="route-info" style={{ cursor: priceTooltip ? 'help' : 'default' }}>{priceText}</div>
          </Tooltip>
        )}
      </header>

      <Form<OrderFormValues>
        form={form}
        layout="vertical"
        className="form"
        requiredMark={false}
        initialValues={useMemo(
          () => ({ vehicle: null, comment: '', fromAddress, toAddress }),
          [fromAddress, toAddress],
        )}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        onValuesChange={(changedValues) => handleValuesChange(changedValues)}
        onFinish={handleFinish}
      >
        <div className="form-field-wrapper">
          <Form.Item
            name="fromAddress"
            label="Откуда"
            rules={[{ required: true, message: 'Укажите адрес отправления' }]}
          >
            <Input
              placeholder="Введите адрес отправления"
              onFocus={onFromFocus}
              onBlur={(e) => onFromBlur(e.target.value)}
              onPressEnter={(e) => onFromSelect((e.target as HTMLInputElement).value)}
              className={activePoint === 'from' ? 'active' : ''}
            />
          </Form.Item>

          {suggestVisible && suggestions.length > 0 && activePoint === 'from' && (
            <ul className="suggest-list">
              {suggestions.map((item) => (
                <li key={item.value} onMouseDown={() => onFromSelect(item.value)}>
                  {item.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-field-wrapper">
          <Form.Item
            name="toAddress"
            label="Куда"
            rules={[{ required: true, message: 'Укажите адрес назначения' }]}
          >
            <Input
              placeholder="Введите адрес назначения"
              onFocus={onToFocus}
              onBlur={(e) => onToBlur(e.target.value)}
              onPressEnter={(e) => onToSelect((e.target as HTMLInputElement).value)}
              className={activePoint === 'to' ? 'active' : ''}
            />
          </Form.Item>

          {suggestVisible && suggestions.length > 0 && activePoint === 'to' && (
            <ul className="suggest-list">
              {suggestions.map((item) => (
                <li key={item.value} onMouseDown={() => onToSelect(item.value)}>
                  {item.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Form.Item<OrderFormValues['vehicle']>
          name="vehicle"
          label="Тип транспорта"
          rules={[{ required: true, message: 'Выберите тип транспорта' }]}
        >
          <Select
            placeholder="Выберите тип транспорта"
            allowClear
            options={[
              { value: 'Внедорожник', label: 'Внедорожник' },
              { value: 'Седан', label: 'Седан' },
              { value: 'Кроссовер', label: 'Кроссовер' },
            ]}
          />
        </Form.Item>

        <Form.Item<OrderFormValues['comment']> name="comment" label="Комментарий">
          <Input.TextArea placeholder="Введите комментарий к заказу" rows={3} />
        </Form.Item>

        <footer>
          <button type="button" className="secondary" onClick={handleClear}>
            Очистить
          </button>
          <button type="submit" className="primary">
            Заказать
          </button>
        </footer>
      </Form>
    </section>
  );
}
