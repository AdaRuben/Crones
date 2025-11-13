import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/shared/api/hooks';
import { signIn, signUp } from '@/entities/regs/thunks/thunks';
import { UserLoginSchema, UserRegisterSchema } from '@/entities/regs/types/types';
import AuthLayout from './components/AuthLayout';
import SigninForm from './components/SigninForm';
import SignupForm from './components/SignupForm';
import './AuthPage.css';

type AuthMode = 'signin' | 'signup';

export default function AuthPage(): React.JSX.Element {
  const [mode, setMode] = useState<AuthMode>('signup');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async (values: Record<string, string>): Promise<void> => {
    const cleanValues = {
      ...values,
      phoneNumber: `+7${values.phoneNumber.replace(/\D/g, '').slice(1)}`,
    };

    const parsed = UserRegisterSchema.parse(cleanValues);
    await dispatch(signUp(parsed)).unwrap();
    message.success('Регистрация успешна!');
    void navigate('/');
  };

  const handleSignin = async (values: Record<string, string>): Promise<void> => {
    const cleanValues = {
      ...values,
      phoneNumber: `+7${values.phoneNumber.replace(/\D/g, '').slice(1)}`,
    };

    const parsed = UserLoginSchema.parse(cleanValues);
    await dispatch(signIn(parsed)).unwrap();
    message.success('Вход успешен!');
  };
  const submitHandlers = {
    signup: handleSignup,
    signin: handleSignin,
  } satisfies Record<AuthMode, (values: Record<string, string>) => Promise<void>>;

  const switchMode = (nextMode: AuthMode): void => {
    setMode(nextMode);
  };

  return (
    <AuthLayout mode={mode} onModeChange={switchMode}>
      {mode === 'signup' ? (
        <SignupForm onSubmit={submitHandlers.signup} />
      ) : (
        <SigninForm onSubmit={submitHandlers.signin} />
      )}
    </AuthLayout>
  );
}
