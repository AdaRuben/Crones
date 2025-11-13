'use client';

import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router';
import { useAppSelector } from '@/shared/api/hooks';
import LogoutButton from '@/features/logout-button/LogoutButton';

export default function Navbar(): React.JSX.Element {
  const userStatus = useAppSelector((store) => store.auth.status);

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (): void => setIsOpen((prev) => !prev);

  const handleNavigate = (path: string): void => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Логотип */}
      <button type="button" className="logo" onClick={() => handleNavigate('/')}>
        КРОКОВОЗ
      </button>

      {/* Десктопные ссылки */}
      <div className="nav-links">
        {userStatus === 'guest' ? (
          <button type="button" onClick={() => handleNavigate('/auth')}>
            Войти
          </button>
        ) : (
          <button type="button" onClick={() => handleNavigate('/history')}>
            Мои заказы
          </button>
        )}
        <button type="button" onClick={() => handleNavigate('/support')} disabled={userStatus !== 'logged'}>
          Чат с поддержкой
        </button>
        <button type="button" onClick={() => handleNavigate('/about')}>
          О нас
        </button>
        <button type="button" onClick={() => handleNavigate('/contacts')}>
          Контакты
        </button>
        {userStatus === 'logged' && <LogoutButton onClick={() => setIsOpen(false)} />}
      </div>

      {/* Бургер-меню */}
      <button
        className={`burger ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Мобильное меню */}
      {isOpen && (
        <div className="mobile-menu">
          {userStatus === 'guest' ? (
            <button type="button" onClick={() => handleNavigate('/auth')}>
              Войти
            </button>
          ) : (
            <button type="button" onClick={() => handleNavigate('/history')}>
              Мои заказы
            </button>
          )}
          {userStatus === 'logged' && (
            <button type="button" onClick={() => handleNavigate('/support')}>
              Чат с поддержкой
            </button>
          )}
          <button type="button" onClick={() => handleNavigate('/about')}>
            О нас
          </button>
          <button type="button" onClick={() => handleNavigate('/contacts')}>
            Контакты
          </button>
          {userStatus === 'logged' && <LogoutButton onClick={() => setIsOpen(false)} />}
        </div>
      )}
    </nav>
  );
}
