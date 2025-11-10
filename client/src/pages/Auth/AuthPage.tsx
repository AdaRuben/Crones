'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/shared/hooks';
import { signIn, signUp } from '../../entities/regs/thunks/thunks';
import { UserLoginSchema, UserRegisterSchema } from '../../entities/regs/types/types';
import './AuthPage.css';

type AuthMode = 'signin' | 'signup';

const { Title, Text } = Typography;

export default function AuthPage(): React.JSX.Element {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [formSignup] = Form.useForm();
  const [formSignin] = Form.useForm();
  const dispatch = useAppDispatch();

  // Форматирование телефона
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits.startsWith('7') && digits !== '') return '+7';
    const rest = digits.slice(1);
    const match = /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/.exec(rest);
    if (!match) return `+7 ${rest}`;
    return `+7 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`.trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
  };

  // Регистрация
  const onSignup = async () => {
    try {
      const values = await formSignup.validateFields();
      const cleanValues = {
        ...values,
        phoneNumber: `+7${values.phoneNumber.replace(/\D/g, '').slice(1)}`,
      };

      // Валидация через zod
      const parsed = UserRegisterSchema.parse(cleanValues);
      await dispatch(signUp(parsed)).unwrap();
      message.success('Регистрация успешна!');
    } catch (error: any) {
      if (error.errorFields) {
        // Ошибки валидации AntD
        return;
      }
      if (error.message) {
        message.error(error.message);
      }
    }
  };

  // Вход
  const onSignin = async () => {
    try {
      const values = await formSignin.validateFields();
      const cleanValues = {
        ...values,
        phoneNumber: `+7${values.phoneNumber.replace(/\D/g, '').slice(1)}`,
      };

      const parsed = UserLoginSchema.parse(cleanValues);
      await dispatch(signIn(parsed)).unwrap();
      message.success('Вход успешен!');
    } catch (error: any) {
      if (error.errorFields) return;
      if (error.message) message.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Space direction="vertical" size="large" className="auth-content">
          <div className="auth-header">
            <Title level={3} className="auth-title">
              {mode === 'signup' ? 'Регистрация' : 'Вход'}
            </Title>
            <Text type="secondary" className="auth-subtitle">
              {mode === 'signup' ? 'Создайте новый аккаунт' : 'Войдите в существующий'}
            </Text>
          </div>

          {/* === РЕГИСТРАЦИЯ === */}
          {mode === 'signup' && (
            <Form form={formSignup} layout="vertical" onFinish={onSignup} className="auth-form">
              <Form.Item
                label="Имя"
                name="name"
                rules={[{ required: true, message: 'Введите имя' }]}
                className="auth-form-item"
              >
                <Input
                  prefix={<UserOutlined className="auth-icon" />}
                  placeholder="Иван Иванов"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                label="Номер телефона"
                name="phoneNumber"
                initialValue="+7 "
                rules={[
                  { required: true, message: 'Введите телефон' },
                  {
                    validator: (_, value) => {
                      const clean = `+7${(value || '').replace(/\D/g, '').slice(1)}`;
                      if (clean.length !== 12) {
                        return Promise.reject('Номер должен содержать 11 цифр');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                className="auth-form-item"
              >
                <Input
                  prefix={<PhoneOutlined className="auth-icon" />}
                  placeholder="+7 999 999 99 99"
                  size="large"
                  className="auth-input"
                  onChange={handlePhoneChange}
                />
              </Form.Item>

              <Form.Item
                label="Пароль"
                name="password"
                rules={[
                  { required: true, message: 'Введите пароль' },
                  { min: 6, message: 'Минимум 6 символов' },
                ]}
                className="auth-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined className="auth-icon" />}
                  placeholder="••••••••"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                label="Подтвердите пароль"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Повторите пароль' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value === getFieldValue('password')) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Пароли не совпадают');
                    },
                  }),
                ]}
                className="auth-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined className="auth-icon" />}
                  placeholder="••••••••"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={false}
                block
                size="large"
                className="auth-submit-btn"
              >
                Зарегистрироваться
              </Button>
            </Form>
          )}

          {/* === ВХОД === */}
          {mode === 'signin' && (
            <Form form={formSignin} layout="vertical" onFinish={onSignin} className="auth-form">
              <Form.Item
                label="Номер телефона"
                name="phoneNumber"
                initialValue="+7 "
                rules={[
                  { required: true, message: 'Введите телефон' },
                  {
                    validator: (_, value) => {
                      const clean = `+7${(value || '').replace(/\D/g, '').slice(1)}`;
                      if (clean.length !== 12) {
                        return Promise.reject('Номер должен содержать 11 цифр');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                className="auth-form-item"
              >
                <Input
                  prefix={<PhoneOutlined className="auth-icon" />}
                  placeholder="+7 999 999 99 99"
                  size="large"
                  className="auth-input"
                  onChange={handlePhoneChange}
                />
              </Form.Item>

              <Form.Item
                label="Пароль"
                name="password"
                rules={[
                  { required: true, message: 'Введите пароль' },
                  { min: 6, message: 'Минимум 6 символов' },
                ]}
                className="auth-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined className="auth-icon" />}
                  placeholder="••••••••"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="auth-submit-btn"
              >
                Войти
              </Button>
            </Form>
          )}

          {/* === ПЕРЕКЛЮЧЕНИЕ === */}
          <div className="auth-switch">
            <Text className="auth-switch-text">
              {mode === 'signup' ? (
                <>
                  Уже есть аккаунт?{' '}
                  <Button
                    type="link"
                    onClick={() => {
                      setMode('signin');
                      formSignup.resetFields();
                    }}
                    className="auth-link"
                  >
                    Войти
                  </Button>
                </>
              ) : (
                <>
                  Нет аккаунта?{' '}
                  <Button
                    type="link"
                    onClick={() => {
                      setMode('signup');
                      formSignin.resetFields();
                    }}
                    className="auth-link"
                  >
                    Зарегистрироваться
                  </Button>
                </>
              )}
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}
