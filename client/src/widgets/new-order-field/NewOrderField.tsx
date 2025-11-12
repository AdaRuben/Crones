import { Form, Input, Select } from 'antd';
import { useEffect, useMemo } from 'react';
import type { ActivePoint, RouteInfo, Suggestion } from '@/entities/maps/types/MapTypes';

type VehicleType = 'Кроссовер' | 'Седан';

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
}: OrderFormProps): React.JSX.Element | null {
  const [form] = Form.useForm<OrderFormValues>();

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
  };

  const handleValuesChange = (changed: Partial<OrderFormValues>): void => {
    if (changed.fromAddress !== undefined) {
      onFromChange(changed.fromAddress);
    }
    if (changed.toAddress !== undefined) {
      onToChange(changed.toAddress);
    }
  };

  return (
    <section className="bottom-sheet">
      <header>
        <div className="title">Вызов эвакуатора</div>
        {routeInfo && (
          <div className="route-info">
            <span>{routeInfo.distance}</span>
            <span>•</span>
            <span>{routeInfo.time}</span>
          </div>
        )}
      </header>

      <Form<OrderFormValues>
        form={form}
        layout="vertical"
        className="form"
        initialValues={useMemo(
          () => ({ vehicle: null, comment: '', fromAddress, toAddress }),
          [fromAddress, toAddress],
        )}
        onValuesChange={(changedValues) => handleValuesChange(changedValues)}
        onFinish={handleFinish}
      >
        <Form.Item
          name="fromAddress"
          rules={[{ required: true, message: 'Укажите адрес отправления' }]}
        >
          <Input
            placeholder="Откуда забрать?"
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

        <Form.Item
          name="toAddress"
          rules={[{ required: true, message: 'Укажите адрес назначения' }]}
        >
          <Input
            placeholder="Куда едем?"
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

        <Form.Item<OrderFormValues['vehicle']> name="vehicle">
          <Select
            placeholder="Выберите тип транспорта"
            allowClear
            options={[
              { value: 'Кроссовер', label: 'Кроссовер' },
              { value: 'Седан', label: 'Седан' },
            ]}
          />
        </Form.Item>

        <Form.Item<OrderFormValues['comment']> name="comment">
          <Input.TextArea placeholder="Комментарий к заказу" rows={3} />
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
