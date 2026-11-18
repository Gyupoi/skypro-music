import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Playlist from './Playlist';
import type { Track } from '@/api/api';

const tracks = [
  {
    _id: 1,
    name: 'Elektro',
    author: 'Dynoro',
    release_date: '2020-05-10',
    genre: ['pop', 'dance'],
    duration_in_seconds: 180,
    album: 'Album 1',
    logo: null,
    track_file: '',
    staredUser: [],
  },
  {
    _id: 2,
    name: 'Troelf',
    author: 'Artist 2',
    release_date: '2018-03-15',
    genre: ['rock'],
    duration_in_seconds: 125,
    album: 'Album 2',
    logo: null,
    track_file: '',
    staredUser: [],
  },
] satisfies Track[];

describe('Playlist', () => {
  const defaultProps = {
    tracks,
    currentTrackId: null,
    isPlaying: false,
    onTrackSelect: vi.fn(),
    favoriteTracks: [],
    onToggleFavorite: vi.fn(),
  };

  it('отображает названия треков, исполнителей и альбомов', () => {
    render(<Playlist {...defaultProps} />);

    expect(screen.getByText('Elektro')).toBeInTheDocument();
    expect(screen.getByText('Dynoro')).toBeInTheDocument();
    expect(screen.getByText('Album 1')).toBeInTheDocument();

    expect(screen.getByText('Troelf')).toBeInTheDocument();
    expect(screen.getByText('Artist 2')).toBeInTheDocument();
    expect(screen.getByText('Album 2')).toBeInTheDocument();
  });

  it('передаёт выбранный трек в onTrackSelect', () => {
    const onTrackSelect = vi.fn();

    render(<Playlist {...defaultProps} onTrackSelect={onTrackSelect} />);

    fireEvent.click(screen.getByText('Elektro'));

    expect(onTrackSelect).toHaveBeenCalledWith(tracks[0]);
  });

  it('передаёт трек в onToggleFavorite', () => {
    const onToggleFavorite = vi.fn();

    render(<Playlist {...defaultProps} onToggleFavorite={onToggleFavorite} />);

    // Кнопка избранного находится внутри компонента Track.
    const favoriteButton = screen
      .getAllByRole('button')
      .find((button) =>
        button.getAttribute('aria-label')?.toLowerCase().includes('избран'),
      );

    expect(favoriteButton).toBeDefined();

    fireEvent.click(favoriteButton!);

    expect(onToggleFavorite).toHaveBeenCalledWith(tracks[0]);
  });
});
