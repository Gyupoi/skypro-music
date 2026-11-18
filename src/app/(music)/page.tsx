'use client';

import { useEffect, useState } from 'react';

import Search from '@/components/Search/Search';
import Filters from '@/components/Filters/Filters';
import Playlist from '@/components/Playlist/Playlist';
import { useMusicPlayer } from '@/components/MainLayout/MainLayout';

import { getTracks, type Track } from '@/api/api';
import {
  searchTracks,
  filterTracks,
  sortTracks,
  type SortOrder,
} from '@/utils/trackUtils';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
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

  function handleToggleAuthor(author: string) {
    setSelectedAuthors((current) =>
      current.includes(author)
        ? current.filter((item) => item !== author)
        : [...current, author],
    );
  }

  function handleToggleGenre(genre: string) {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre],
    );
  }

  const searchedTracks = searchTracks(tracks, searchQuery);

  const filteredTracks = filterTracks(
    searchedTracks,
    selectedAuthors,
    selectedGenres,
  );

  const displayedTracks = sortTracks(filteredTracks, sortOrder);

  return (
    <>
      <Search value={searchQuery} onChange={setSearchQuery} />

      <h2 className="centerblock__h2">Треки</h2>

      <Filters
        tracks={tracks}
        selectedAuthors={selectedAuthors}
        selectedGenres={selectedGenres}
        sortOrder={sortOrder}
        onToggleAuthor={handleToggleAuthor}
        onToggleGenre={handleToggleGenre}
        onSortChange={setSortOrder}
      />

      {isLoading && <p>Загрузка треков...</p>}

      {error && <p role="alert">{error}</p>}

      {favoriteError && <p role="alert">{favoriteError}</p>}

      {!isLoading && !error && displayedTracks.length === 0 && (
        <p>Нет подходящих треков</p>
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

export default function Home() {
  return <HomeContent />;
}
