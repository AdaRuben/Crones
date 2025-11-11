import { logoutThunk } from '@/entities/user/model/thunks';
import { useAppDispatch } from '@/shared/hooks';
import { Button } from '@mui/material';
import React from 'react';

type Props = {
  onSuccess?: () => void;
};

export default function LogoutButton({ onSuccess }: Props): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Button color="inherit" onClick={() => dispatch(logoutThunk()).then(onSuccess)}>
      SIGNOUT
    </Button>
  );
}