import { describe, it, expect } from 'vitest';
import type { Track } from '@/api/api';
import { searchTracks, filterTracks, sortTracks } from './trackUtils';

const tracks: Track[] = [
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
  {
    _id: 3,
    name: 'FooTroBar',
    author: 'Dynoro',
    release_date: '2022-01-20',
    genre: ['dance'],
    duration_in_seconds: 220,
    album: 'Album 3',
    logo: null,
    track_file: '',
    staredUser: [],
  },
];

describe('searchTracks', () => {
  it('ищет совпадение внутри названия без учёта регистра', () => {
    expect(searchTracks(tracks, 'tro').map((track) => track._id)).toEqual([
      1, 2, 3,
    ]);
  });

  it('возвращает все треки при пустом запросе', () => {
    expect(searchTracks(tracks, '').length).toBe(3);
  });

  it('возвращает пустой массив, если совпадений нет', () => {
    expect(searchTracks(tracks, 'неизвестный').length).toBe(0);
  });
});

describe('filterTracks', () => {
  it('фильтрует по нескольким исполнителям', () => {
    const result = filterTracks(tracks, ['Dynoro', 'Artist 2'], []);

    expect(result).toHaveLength(3);
  });

  it('фильтрует по нескольким жанрам', () => {
    const result = filterTracks(tracks, [], ['rock', 'pop']);

    expect(result.map((track) => track._id)).toEqual([1, 2]);
  });

  it('учитывает исполнителя и жанр одновременно', () => {
    const result = filterTracks(tracks, ['Dynoro'], ['dance']);

    expect(result.map((track) => track._id)).toEqual([1, 3]);
  });
});

describe('sortTracks', () => {
  it('сортирует от старых треков к новым', () => {
    const result = sortTracks(tracks, 'oldest');

    expect(result.map((track) => track._id)).toEqual([2, 1, 3]);
  });

  it('сортирует от новых треков к старым', () => {
    const result = sortTracks(tracks, 'newest');

    expect(result.map((track) => track._id)).toEqual([3, 1, 2]);
  });

  it('сохраняет исходный порядок по умолчанию', () => {
    const result = sortTracks(tracks, 'default');

    expect(result.map((track) => track._id)).toEqual([1, 2, 3]);
  });
});
