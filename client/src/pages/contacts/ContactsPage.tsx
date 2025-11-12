import React from 'react';
import { Typography, Card, Space } from 'antd';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import './ContactsPage.css';

const { Title, Paragraph, Text } = Typography;

export default function ContactsPage(): React.JSX.Element {
  const contactInfo = [
    {
      icon: <PhoneOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Телефон',
      content: '+7 (999) 898-62-26',
      link: 'tel:+79998986226',
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Адрес',
      content:
        '115191, город Москва, 5-Й Рощинский проезд, д. 7/8, этаж/пом. 1/III ком. / офис 1г/2-1',
      link: null,
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Режим работы',
      content: 'Круглосуточно, 24/7',
      link: null,
    },
    {
      icon: <MailOutlined style={{ fontSize: '24px', color: '#ffd700' }} />,
      title: 'Email',
      content: 'info@krokovoz.ru',
      link: 'mailto:info@krokovoz.ru',
    },
  ];

  return (
    <div className="contacts-page">
      <div className="contacts-hero">
        <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
          <PhoneOutlined style={{ fontSize: '48px', color: '#ffd700' }} />
          <Title level={1} className="contacts-title">
            Контакты
          </Title>
          <Title level={3} className="contacts-subtitle">
            Мы всегда на связи
          </Title>
        </Space>
      </div>

      <div className="contacts-content">
        <Card className="contacts-intro-card">
          <Paragraph className="contacts-intro-text" style={{ textAlign: 'center' }}>
            <Text strong style={{ fontSize: '18px' }}>
              Свяжитесь с нами любым удобным способом
            </Text>
          </Paragraph>
          <Paragraph className="contacts-intro-text" style={{ textAlign: 'center' }}>
            Наши специалисты готовы ответить на все ваши вопросы и помочь с оформлением заказа
          </Paragraph>
        </Card>

        <div className="contacts-grid">
          {contactInfo.map((item) => (
            <Card key={item.title} className="contact-card" hoverable={!!item.link}>
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <div className="contact-icon">{item.icon}</div>
                <Title level={4} className="contact-title">
                  {item.title}
                </Title>
                {item.link ? (
                  <a href={item.link} className="contact-link">
                    <Text className="contact-content">{item.content}</Text>
                  </a>
                ) : (
                  <Text className="contact-content">{item.content}</Text>
                )}
              </Space>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
