
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.mainNav}>
      <div className={styles.navLogo}>
        <Image
          width={250}
          height={170}
          className={styles.logoImage}
          src="/img/logo.png"
          alt="logo"
        />
      </div>

      <button
        type="button"
        className={styles.navBurger}
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isMenuOpen}
      >
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </button>

      <div
        className={classNames(styles.navMenu, {
          [styles.navMenuOpen]: isMenuOpen,
        })}
      >
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link
              href="/"
              className={styles.menuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Главное
            </Link>
          </li>

          <li className={styles.menuItem}>
            <Link
              href="#"
              className={styles.menuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Мой плейлист
            </Link>
          </li>

          <li className={styles.menuItem}>
            <Link
              href="/auth/signin"
              className={styles.menuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
