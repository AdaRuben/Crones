import { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { useAppDispatch } from '@/shared/hooks';
import type { Order } from '@/entities/order/model/type';
import { setStatus } from '@/entities/order/model/slice';
import { editOrder } from '@/entities/order/model/thunks';

type EditOrderProps = {
  editing: Order | null;
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditStatus({
  editing,
  setVisibleEdit,
}: EditOrderProps): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const [status, setLocalStatus] = useState<Order['status']>('new');

  useEffect(() => {
    if (editing) {
      setLocalStatus(editing.status);
    }
  }, [editing]);

  if (!editing) return null;

  const handleStatusChange = (nextStatus: Order['status']) => {
    setLocalStatus(nextStatus);
    dispatch(setStatus({ id: editing.id, status: nextStatus }));
  };

  const handleSave = async () => {
    const { id, ...rest } = editing;
    try {
      await dispatch(
        editOrder({
          id,
          order: { ...rest, status },
        })
      ).unwrap();
      setVisibleEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit-order">
      <Select
        className="statusList"
        value={status}
        style={{ width: 200 }}
        onChange={handleStatusChange}
      >
        <Select.Option value="new">Новый</Select.Option>
        <Select.Option value="in process">В процессе</Select.Option>
        <Select.Option value="finished">Завершен</Select.Option>
        <Select.Option value="cancelled">Отменен</Select.Option>
      </Select>
      <Button type="primary" onClick={handleSave}>
        Сохранить
      </Button>
    </div>
  );
}