'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, getTokens } from '@/api/api';
import styles from '../auth.module.css';

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      const tokens = await getTokens(email, password);

      localStorage.setItem('access', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/');
    } catch {
      setError('Неверная почта или пароль');
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

        {error && <p className={styles.message}>{error}</p>}

        <button className={styles.submit} type="submit" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </button>

        <Link className={styles.link} href="/auth/signup">
          Зарегистрироваться
        </Link>
      </form>
    </main>
  );
}
