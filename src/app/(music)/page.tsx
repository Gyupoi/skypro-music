'use client';

import { useEffect, useState } from 'react';

import Search from '@/components/Search/Search';
import Filters from '@/components/Filters/Filters';
import Playlist from '@/components/Playlist/Playlist';
import { useMusicPlayer } from '@/components/MainLayout/MainLayout';

import { getTracks, type Track } from '@/api/api';

function HomeContent() {
  const {
    currentTrack,
    isPlaying,
    setQueue,
    onTrackSelect,
    favoriteTracks,
    toggleFavorite,
  } = useMusicPlayer();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteError, setFavoriteError] = useState('');

  useEffect(() => {
    async function loadTracks() {
      try {
        setIsLoading(true);
        setError('');

        const fetchedTracks = await getTracks();

        setTracks(fetchedTracks);
        setQueue(fetchedTracks);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Не удалось загрузить треки',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTracks();
  }, [setQueue]);

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

  return (
    <>
      <Search />

      <h2 className="centerblock__h2">Треки</h2>

      <Filters tracks={tracks} />

      {isLoading && <p>Загрузка треков...</p>}

      {error && <p role="alert">{error}</p>}

      {favoriteError && <p role="alert">{favoriteError}</p>}

      {!isLoading && !error && tracks.length === 0 && <p>Треки не найдены</p>}

      {!isLoading && !error && tracks.length > 0 && (
        <Playlist
          tracks={tracks}
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

export default function Home() {
  return <HomeContent />;
}
