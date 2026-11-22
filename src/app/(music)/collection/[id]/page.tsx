'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { useMusicPlayer } from '@/components/MainLayout/MainLayout';

import Search from '@/components/Search/Search';
import Playlist from '@/components/Playlist/Playlist';

import {
  getCollectionTracks,
  getCollection,
  type Track,
  type Collection,
} from '@/api/api';

import { searchTracks } from '@/utils/trackUtils';

function CollectionContent() {
  const params = useParams();
  const id = Number(params.id);

  const {
    currentTrack,
    isPlaying,
    setQueue,
    onTrackSelect,
    favoriteTracks,
    toggleFavorite,
  } = useMusicPlayer();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteError, setFavoriteError] = useState('');

  useEffect(() => {
    async function loadCollection() {
      try {
        setIsLoading(true);
        setError('');

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error('Некорректный адрес подборки');
        }

        const [collectionData, collectionTracks] = await Promise.all([
          getCollection(id),
          getCollectionTracks(id),
        ]);

        setCollection(collectionData);
        setTracks(collectionTracks);
        setQueue(collectionTracks);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить подборку',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCollection();
  }, [id, setQueue]);

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

  const displayedTracks = searchTracks(tracks, searchQuery);

  return (
    <>
      <Search value={searchQuery} onChange={setSearchQuery} />

      <h2 className="centerblock__h2">{collection?.name || 'Подборка'}</h2>

      {isLoading && <p>Загрузка подборки...</p>}

      {error && <p role="alert">{error}</p>}

      {favoriteError && <p role="alert">{favoriteError}</p>}

      {!isLoading && !error && displayedTracks.length === 0 && (
        <p>
          {searchQuery ? 'Треки не найдены' : 'В этой подборке пока нет треков'}
        </p>
      )}

      {!isLoading && !error && displayedTracks.length > 0 && (
        <Playlist
          tracks={displayedTracks}
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

export default function CollectionPage() {
  return <CollectionContent />;
}
