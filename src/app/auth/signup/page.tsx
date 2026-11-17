'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/api/api';
import styles from '../auth.module.css';

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return;
    }

    if (password !== repeatPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      const username =
        email.split('@')[0].replace(/[^a-zA-Z0-9@.+_-]/g, '') || 'user';

      await registerUser(email, password, username);

      router.push('/auth/signin');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Не удалось зарегистрироваться',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <span className={styles.logoBlue}></span>
            <span className={styles.logoGreen}></span>
          </span>
          skypro
        </div>

        <input
          className={styles.input}
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Повторите пароль"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          required
        />

        {error && <p className={styles.message}>{error}</p>}

        <button className={styles.submit} type="submit" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <Link className={styles.link} href="/auth/signin">
          Войти
        </Link>
      </form>
    </main>
  );
}
