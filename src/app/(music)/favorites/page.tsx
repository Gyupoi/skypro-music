'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMusicPlayer } from '@/components/MainLayout/MainLayout';
import Search from '@/components/Search/Search';
import Playlist from '@/components/Playlist/Playlist';
import type { Track } from '@/api/api';

export default function FavoritesPage() {
  const router = useRouter();

  const {
    currentTrack,
    isPlaying,
    onTrackSelect,
    favoriteTracks,
    toggleFavorite,
  } = useMusicPlayer();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [favoriteError, setFavoriteError] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('access');

    if (!accessToken) {
      router.replace('/auth/signin');
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  async function handleToggleFavorite(track: Track) {
    try {
      setFavoriteError('');
      await toggleFavorite(track);
    } catch (error) {
      setFavoriteError(
        error instanceof Error
          ? error.message
          : 'Не удалось изменить избранное',
      );
    }
  }

  if (isCheckingAuth) {
    return <p>Проверка авторизации...</p>;
  }

  return (
    <>
      <Search />

      <h2 className="centerblock__h2">Мой плейлист</h2>

      {favoriteError && <p role="alert">{favoriteError}</p>}

      {favoriteTracks.length === 0 ? (
        <p>В избранном пока нет треков</p>
      ) : (
        <Playlist
          tracks={favoriteTracks}
          currentTrackId={currentTrack?._id ?? null}
          isPlaying={isPlaying}
          onTrackSelect={onTrackSelect}
          favoriteTracks={favoriteTracks}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </>
  );
}
