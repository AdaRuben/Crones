import { ordernewSchema } from '@/entities/order/model/schema';
import { editOrder } from '@/entities/order/model/thunks';
import { useAppDispatch } from '@/shared/hooks';
import type { Order } from '@/entities/order/model/type'
import React from 'react'

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Switch } from 'antd';

export default function EditOrder({setVisibleEdit, editing}: {setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>, editing: Order | null}): React.JSX.Element {

  const dispatch = useAppDispatch();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) :void =>  {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const validData = ordernewSchema.parse(data);

    void dispatch(editOrder({id: editing.id, order: validData}));

    setVisibleEdit(false);
  }

  return (
    <>gg</>
  )
}
