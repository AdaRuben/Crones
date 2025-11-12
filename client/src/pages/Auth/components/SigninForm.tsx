// client/src/pages/Auth/components/SigninForm.tsx
import { Form, Input, Button } from 'antd';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import usePhoneFormatter from './usePhoneFormatter';

type SigninFormProps = {
  onSubmit: (values: Record<string, string>) => Promise<void>;
};

export default function SigninForm({ onSubmit }: SigninFormProps): React.JSX.Element {
  const [form] = Form.useForm();
  const { handlePhoneChange } = usePhoneFormatter();

  const handleFinish = async (values: Record<string, string>): Promise<void> => {
    try {
      await onSubmit(values);
      form.resetFields(['password']);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message) throw error;
      }
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} className="auth-form">
      <Form.Item
        label="Номер телефона"
        name="phoneNumber"
        initialValue="+7 "
        rules={[
          { required: true, message: 'Введите телефон' },
          {
            validator: (_rule, rawValue) => {
              const value = typeof rawValue === 'string' ? rawValue : '';
              const clean = `+7${value.replace(/\D/g, '').slice(1)}`;

              if (clean.length !== 12) {
                return Promise.reject(new Error('Номер должен содержать 11 цифр'));
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

      <Button type="primary" htmlType="submit" block size="large" className="auth-submit-btn">
        Войти
      </Button>
    </Form>
  );
}
