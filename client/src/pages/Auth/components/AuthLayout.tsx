// client/src/pages/Auth/components/AuthLayout.tsx
import { Card, Space, Typography, Button } from 'antd';
import type { PropsWithChildren } from 'react';
// import 'AuthPage.css'; // можно переиспользовать AuthPage.css

const { Title, Text } = Typography;

type AuthLayoutProps = PropsWithChildren<{
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}>;

export default function AuthLayout({ mode, onModeChange, children }: AuthLayoutProps): React.JSX.Element {
  const toggleLabel =
    mode === 'signup'
      ? { question: 'Уже есть аккаунт?', action: 'Войти', next: 'signin' as const }
      : { question: 'Нет аккаунта?', action: 'Зарегистрироваться', next: 'signup' as const };

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

          {children}

          <div className="auth-switch">
            <Text className="auth-switch-text">
              {toggleLabel.question}{' '}
              <Button
                type="link"
                onClick={() => onModeChange(toggleLabel.next)}
                className="auth-link"
              >
                {toggleLabel.action}
              </Button>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}