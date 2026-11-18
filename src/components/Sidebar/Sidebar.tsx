'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');

    router.push('/auth/signin');
  }

  return (
    <div className={styles.mainSidebar}>
      <div className={styles.sidebarPersonal}>
        <button
          type="button"
          className={styles.sidebarIcon}
          onClick={handleLogout}
          aria-label="Выйти"
          title="Выйти"
        >
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </button>
      </div>

      <div className={styles.sidebarBlock}>
        <div className={styles.sidebarList}>
          <div className={styles.sidebarItem}>
            <Link className={styles.sidebarLink} href="/collection/2">
              <Image
                className={styles.sidebarImg}
                src="/img/playlist01.png"
                alt="Плейлист дня"
                width={250}
                height={170}
                priority
              />
            </Link>
          </div>

          <div className={styles.sidebarItem}>
            <Link className={styles.sidebarLink} href="/collection/3">
              <Image
                className={styles.sidebarImg}
                src="/img/playlist02.png"
                alt="Танцевальные хиты"
                width={250}
                height={170}
              />
            </Link>
          </div>

          <div className={styles.sidebarItem}>
            <Link className={styles.sidebarLink} href="/collection/4">
              <Image
                className={styles.sidebarImg}
                src="/img/playlist03.png"
                alt="Инди-заряд"
                width={250}
                height={170}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
