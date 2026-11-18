'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { useMusicPlayer } from '@/components/MainLayout/MainLayout';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const router = useRouter();
  const { clearFavorites } = useMusicPlayer();

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('access')));
    setIsAuthChecked(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');

    clearFavorites();

    setIsAuthenticated(false);
    setIsMenuOpen(false);

    router.push('/auth/signin');
  }

  function handleLogin() {
    setIsMenuOpen(false);
    router.push('/auth/signin');
  }

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
              href="/favorites"
              className={styles.menuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Мой плейлист
            </Link>
          </li>

          {isAuthChecked && (
            <li className={styles.menuItem}>
              {isAuthenticated ? (
                <button
                  type="button"
                  className={styles.menuLink}
                  onClick={handleLogout}
                >
                  Выход
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.menuLink}
                  onClick={handleLogin}
                >
                  Войти
                </button>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
