'use client';

import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router';

export default function Navbar() {
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
        <a href="/signin">Войти</a>
        <a href="/about">О нас</a>
        <a href="/contacts">Контакты</a>
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
          <a href="/signin" onClick={toggleMenu}>
            Войти
          </a>
          <a href="/about" onClick={toggleMenu}>
            О нас
          </a>
          <a href="/contacts" onClick={toggleMenu}>
            Контакты
          </a>
        </div>
      )}
    </nav>
  );
}
