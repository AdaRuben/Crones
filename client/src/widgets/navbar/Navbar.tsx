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

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      {/* Логотип */}
      <div className="logo" onClick={() => navigate('/')}>
        КРОКОВОЗ
      </div>

      {/* Десктопные ссылки */}
      <div className="nav-links">
        {userStatus === 'guest' ? (
          <a href="/auth" onClick={toggleMenu}>
            Войти
          </a>
        ) : (
          <a href="/history" onClick={toggleMenu}>
            Мои заказы
          </a>
        )}
        <a href="/about" onClick={toggleMenu}>
          О нас
        </a>
        <a href="/contacts" onClick={toggleMenu}>
          Контакты
        </a>
        {userStatus === 'logged' && <LogoutButton onClick={toggleMenu} />}
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
            <a href="/auth" onClick={toggleMenu}>
              Войти
            </a>
          ) : (
            <a href="/history" onClick={toggleMenu}>
              Мои заказы
            </a>
          )}
          <a href="/about" onClick={toggleMenu}>
            О нас
          </a>
          <a href="/contacts" onClick={toggleMenu}>
            Контакты
          </a>
          {userStatus === 'logged' && <LogoutButton onClick={toggleMenu} />}
        </div>
      )}
    </nav>
  );
}
