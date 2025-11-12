import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Select, Typography, App } from 'antd';
import axiosInstance from '@/shared/axiosInstance';

type Driver = {
  id: number;
  name: string;
  phoneNumber: string;
};

type ChoiceDriverProps = {
  open: boolean;
  onCancel: () => void;
  onSelect: (driverId: number) => void;
};

function ChoiceDriver({ open, onCancel, onSelect }: ChoiceDriverProps): React.JSX.Element {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const { notification } = App.useApp();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void axiosInstance
      .get<Driver[]>('/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        notification.error({ message: 'Не удалось загрузить список водителей', description: msg });
      })
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedDriverId(null);
    }
  }, [open]);

  const options = useMemo(
    () =>
      drivers.map((d) => ({
        value: d.id,
        label: `${d.name} (${d.phoneNumber})`,
      })),
    [drivers],
  );

  return (
    <Modal
      open={open}
      title="Выбор водителя"
      okText="Назначить"
      cancelText="Отмена"
      okButtonProps={{ disabled: selectedDriverId == null }}
      confirmLoading={loading}
      onOk={() => selectedDriverId != null && onSelect(selectedDriverId)}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Typography.Paragraph>Пожалуйста, выберите водителя для назначения на заказ.</Typography.Paragraph>
      <Select
        style={{ width: '100%' }}
        placeholder="Выберите водителя"
        loading={loading}
        options={options}
        value={selectedDriverId ?? undefined}
        onChange={setSelectedDriverId}
        showSearch
        optionFilterProp="label"
      />
    </Modal>
  );
}

export default ChoiceDriver;