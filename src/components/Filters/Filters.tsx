'use client';

import { useState } from 'react';
import classNames from 'classnames';
import type { Track } from '@/api/api';
import type { SortOrder } from '@/utils/trackUtils';
import styles from './Filters.module.css';

type FilterName = 'author' | 'year' | 'genre';

type FiltersProps = {
  tracks: Track[];
  selectedAuthors: string[];
  selectedGenres: string[];
  sortOrder: SortOrder;
  onToggleAuthor: (author: string) => void;
  onToggleGenre: (genre: string) => void;
  onSortChange: (order: SortOrder) => void;
};

export default function Filters({
  tracks,
  selectedAuthors,
  selectedGenres,
  sortOrder,
  onToggleAuthor,
  onToggleGenre,
  onSortChange,
}: FiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  const authors = [...new Set(tracks.map((track) => track.author))].sort();

  const genres = Array.from(
    new Set(
      tracks.flatMap((track) =>
        Array.isArray(track.genre)
          ? track.genre
              .filter((genre): genre is string => typeof genre === 'string')
              .map((genre) => genre.trim())
              .filter(Boolean)
          : [],
      ),
    ),
  ).sort((a, b) => a.localeCompare(b, 'ru'));

  const years = [
    ...new Set(
      tracks
        .map((track) => String(track.release_date ?? '').slice(0, 4))
        .filter((year) => /^\d{4}$/.test(year)),
    ),
  ].sort((a, b) => Number(b) - Number(a));

  const filters: {
    key: FilterName;
    label: string;
    items: string[];
    selectedCount: number;
  }[] = [
    {
      key: 'author',
      label: 'исполнителю',
      items: authors,
      selectedCount: selectedAuthors.length,
    },
    {
      key: 'year',
      label: 'году выпуска',
      items: years,
      selectedCount: sortOrder === 'default' ? 0 : 1,
    },
    {
      key: 'genre',
      label: 'жанру',
      items: genres,
      selectedCount: selectedGenres.length,
    },
  ];

  function handleFilterClick(name: FilterName) {
    setActiveFilter((current) => (current === name ? null : name));
  }

  function handleItemClick(filter: FilterName, item: string) {
    if (filter === 'author') {
      onToggleAuthor(item);
    }

    if (filter === 'genre') {
      onToggleGenre(item);
    }
  }

  function isSelected(filter: FilterName, item: string) {
    if (filter === 'author') {
      return selectedAuthors.includes(item);
    }

    if (filter === 'genre') {
      return selectedGenres.includes(item);
    }

    return false;
  }

  return (
    <div className={styles.centerblockFilter}>
      <div className={styles.filterTitle}>Искать по:</div>

      {filters.map((filter) => (
        <div className={styles.filterWrapper} key={filter.key}>
          <button
            type="button"
            className={classNames(styles.filterButton, {
              [styles.active]:
                activeFilter === filter.key || filter.selectedCount > 0,
            })}
            onClick={() => handleFilterClick(filter.key)}
            aria-expanded={activeFilter === filter.key}
          >
            {filter.label}
            {filter.selectedCount > 0 && ` (${filter.selectedCount})`}
          </button>

          {activeFilter === filter.key && (
            <div className={styles.filterList}>
              <div className={styles.filterListScroll}>
                {filter.key === 'year' ? (
                  <>
                    <button
                      type="button"
                      className={classNames(styles.filterItem, {
                        [styles.selected]: sortOrder === 'default',
                      })}
                      onClick={() => onSortChange('default')}
                    >
                      По умолчанию
                    </button>

                    <button
                      type="button"
                      className={classNames(styles.filterItem, {
                        [styles.selected]: sortOrder === 'oldest',
                      })}
                      onClick={() => onSortChange('oldest')}
                    >
                      Сначала старые
                    </button>

                    <button
                      type="button"
                      className={classNames(styles.filterItem, {
                        [styles.selected]: sortOrder === 'newest',
                      })}
                      onClick={() => onSortChange('newest')}
                    >
                      Сначала новые
                    </button>
                  </>
                ) : (
                  filter.items.map((item) => (
                    <button
                      type="button"
                      className={classNames(styles.filterItem, {
                        [styles.selected]: isSelected(filter.key, item),
                      })}
                      key={item}
                      onClick={() => handleItemClick(filter.key, item)}
                    >
                      {item}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
