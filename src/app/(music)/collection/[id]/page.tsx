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

function CollectionContent() {
  const params = useParams();
  const id = Number(params.id);

  const { currentTrack, isPlaying, setQueue, onTrackSelect } = useMusicPlayer();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <>
      <Search />

      <h2 className="centerblock__h2">{collection?.name || 'Подборка'}</h2>

      {isLoading && <p>Загрузка подборки...</p>}

      {error && <p role="alert">{error}</p>}

      {!isLoading && !error && tracks.length === 0 && (
        <p>В этой подборке пока нет треков</p>
      )}

      {!isLoading && !error && tracks.length > 0 && (
        <Playlist
          tracks={tracks}
          currentTrackId={currentTrack?._id ?? null}
          isPlaying={isPlaying}
          onTrackSelect={onTrackSelect}
        />
      )}
    </>
  );
}

export default function CollectionPage() {
  return <CollectionContent />;
}
