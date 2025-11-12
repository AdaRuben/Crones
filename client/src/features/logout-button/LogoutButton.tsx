import { useAppDispatch } from '@/shared/api/hooks';
import { signOut } from '@/entities/regs/thunks/thunks';
import { Button } from 'antd';
import React from 'react';

type Props = {
  onClick?: () => void;
};

export default function LogoutButton({ onClick }: Props): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Button
      type="text"
      onClick={() => dispatch(signOut()).then(onClick)}
      block
      style={{
        color: '#fff',
        padding: '0.8rem 0',
        width: '100%',
        textAlign: 'center',
        fontSize: '1.2rem',
        height: 'auto',
        border: 'none',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      Выйти
    </Button>
  );
}
