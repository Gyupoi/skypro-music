import type { Track } from '@/api/api';

export type SortOrder = 'default' | 'oldest' | 'newest';

// Поиск треков по названию
export function searchTracks(tracks: Track[], query: string): Track[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return tracks;
  }

  return tracks.filter((track) =>
    track.name.toLowerCase().includes(normalizedQuery),
  );
}

// Фильтрация по исполнителям и жанрам
export function filterTracks(
  tracks: Track[],
  selectedAuthors: string[],
  selectedGenres: string[],
): Track[] {
  return tracks.filter((track) => {
    const matchesAuthor =
      selectedAuthors.length === 0 || selectedAuthors.includes(track.author);

    const matchesGenre =
      selectedGenres.length === 0 ||
      track.genre.some((genre) => selectedGenres.includes(genre));

    return matchesAuthor && matchesGenre;
  });
}

// Сортировка по дате релиза
export function sortTracks(tracks: Track[], sortOrder: SortOrder): Track[] {
  if (sortOrder === 'default') {
    return tracks;
  }

  return [...tracks].sort((a, b) => {
    const dateA = new Date(a.release_date).getTime();
    const dateB = new Date(b.release_date).getTime();

    if (sortOrder === 'oldest') {
      return dateA - dateB;
    }

    return dateB - dateA;
  });
}
