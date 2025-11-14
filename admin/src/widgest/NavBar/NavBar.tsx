import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { logoutThunk } from '@/entities/user/model/thunks';

const { Header } = Layout;

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector((state) => state.user.isLogin);

  const menuItems = useMemo<MenuProps['items']>(() => {
    if (!isLogin) {
      return [
        {
          key: '/signin',
          label: 'Вход',
        },
        {
          key: '/signup',
          label: 'Регистрация',
        },
      ];
    }

    return [
      {
        key: '/',
        label: 'Заказы',
      },
      {
        key: '/support',
        label: 'Чаты поддержки',
      },
      {
        key: 'logout',
        label: 'Выйти',
        danger: true,
      },
    ];
  }, [isLogin]);

  const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      await dispatch(logoutThunk());
      navigate('/signin', { replace: true });
      return;
    }
    navigate(key);
  };

  const selectedKey = useMemo(() => {
    if (!isLogin) {
      if (location.pathname.startsWith('/signup')) return '/signup';
      return '/signin';
    }
    if (location.pathname.startsWith('/support')) return '/support';
    return '/';
  }, [isLogin, location.pathname]);

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="admin-logo"
        style={{ marginRight: 24, fontWeight: 600, color: '#ffffff' }}
      >
        КРОКОВОЗ ADMIN
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
};

export default NavBar;
