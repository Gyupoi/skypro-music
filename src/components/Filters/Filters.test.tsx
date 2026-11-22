import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Filters from './Filters';
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
    duration_in_seconds: 200,
    album: 'Album 2',
    logo: null,
    track_file: '',
    staredUser: [],
  },
] satisfies Track[];

describe('Filters', () => {
  const defaultProps = {
    tracks,
    selectedAuthors: [],
    selectedGenres: [],
    sortOrder: 'default' as const,
    onToggleAuthor: vi.fn(),
    onToggleGenre: vi.fn(),
    onSortChange: vi.fn(),
  };

  it('отображает кнопки фильтров', () => {
    render(<Filters {...defaultProps} />);

    expect(screen.getByText('исполнителю')).toBeInTheDocument();
    expect(screen.getByText('году выпуска')).toBeInTheDocument();
    expect(screen.getByText('жанру')).toBeInTheDocument();
  });

  it('открывает список исполнителей', () => {
    render(<Filters {...defaultProps} />);

    fireEvent.click(screen.getByText('исполнителю'));

    expect(screen.getByText('Dynoro')).toBeInTheDocument();
    expect(screen.getByText('Artist 2')).toBeInTheDocument();
  });

  it('вызывает onToggleAuthor при выборе исполнителя', () => {
    const onToggleAuthor = vi.fn();

    render(<Filters {...defaultProps} onToggleAuthor={onToggleAuthor} />);

    fireEvent.click(screen.getByText('исполнителю'));
    fireEvent.click(screen.getByText('Dynoro'));

    expect(onToggleAuthor).toHaveBeenCalledWith('Dynoro');
  });

  it('вызывает onToggleGenre при выборе жанра', () => {
    const onToggleGenre = vi.fn();

    render(<Filters {...defaultProps} onToggleGenre={onToggleGenre} />);

    fireEvent.click(screen.getByText('жанру'));
    fireEvent.click(screen.getByText('pop'));

    expect(onToggleGenre).toHaveBeenCalledWith('pop');
  });

  it('вызывает onSortChange при выборе сортировки', () => {
    const onSortChange = vi.fn();

    render(<Filters {...defaultProps} onSortChange={onSortChange} />);

    fireEvent.click(screen.getByText('году выпуска'));
    fireEvent.click(screen.getByText('Сначала старые'));

    expect(onSortChange).toHaveBeenCalledWith('oldest');
  });
});
