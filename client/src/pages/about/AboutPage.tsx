import React from 'react';
import { Typography, Card, List, Space } from 'antd';
import {
  DollarOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  CarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './AboutPage.css';

const { Title, Paragraph, Text } = Typography;

export default function AboutPage(): React.JSX.Element {
  const features = [
    {
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Фиксированные цены',
      description: 'Фиксированные цены на эвакуацию автомобилей',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Быстрая подача',
      description: 'Быструю подачу эвакуатора',
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Опытные водители',
      description:
        'Водителей, имеющих большой опыт в эвакуации автомобилей, профессионалов своего дела',
    },
    {
      icon: <HeartOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Ответственный подход',
      description: 'Ответственный подход к каждому заказу',
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Круглосуточно',
      description: 'Возможность круглосуточной подачи эвакуатора',
    },
    {
      icon: <CreditCardOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Безналичный расчет',
      description: 'Возможность оплаты безналичным расчетом',
    },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <CarOutlined style={{ fontSize: '64px', color: '#ffd700' }} />
          <Title level={1} className="about-title">
            Кроковоз
          </Title>
          <Title level={3} className="about-subtitle">
            Служба эвакуации автомобилей
          </Title>
        </Space>
      </div>

      <div className="about-content">
        <Card className="about-intro-card">
          <Paragraph className="about-intro-text">
            <Text strong style={{ fontSize: '18px' }}>
              Кроковоз - это служба эвакуации.
            </Text>
          </Paragraph>
          <Paragraph className="about-intro-text">
            Работаем <Text strong>24/7</Text>, свои водители,{' '}
            <Text strong type="warning">
              НЕ ПОСРЕДНИКИ
            </Text>
            , поэтому имеем возможность предлагать очень интересные цены, трепетно относиться к
            каждой эвакуации и предоставлять максимально качественный сервис.
          </Paragraph>
        </Card>

        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 3,
          }}
          dataSource={features}
          renderItem={(item) => (
            <List.Item>
              <Card className="feature-card" hoverable>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <div className="feature-icon">{item.icon}</div>
                  <Title level={4} className="feature-title">
                    {item.title}
                  </Title>
                  <Paragraph className="feature-description" style={{ textAlign: 'center' }}>
                    {item.description}
                  </Paragraph>
                </Space>
              </Card>
            </List.Item>
          )}
        />

        <Card className="about-cta-card">
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <Title level={3}>Профессиональный сервис</Title>
            <Paragraph style={{ fontSize: '16px' }}>
              Мы гарантируем высокое качество обслуживания и индивидуальный подход к каждому
              клиенту. Наша команда профессионалов всегда готова прийти на помощь в любое время
              суток.
            </Paragraph>
          </Space>
        </Card>
      </div>
    </div>
  );
}
