'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { data } from '../../../data';
import styles from './Filters.module.css';

type FilterName = 'author' | 'year' | 'genre';

const tracks = data;

export default function Filters() {
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
  }[] = [
    { key: 'author', label: 'исполнителю', items: authors },
    { key: 'year', label: 'году выпуска', items: years },
    { key: 'genre', label: 'жанру', items: genres },
  ];

  function handleFilterClick(name: FilterName) {
    setActiveFilter((current) => (current === name ? null : name));
  }

  return (
    <div className={styles.centerblockFilter}>
      <div className={styles.filterTitle}>Искать по:</div>

      {filters.map((filter) => (
        <div className={styles.filterWrapper} key={filter.key}>
          <button
            type="button"
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === filter.key,
            })}
            onClick={() => handleFilterClick(filter.key)}
            aria-expanded={activeFilter === filter.key}
          >
            {filter.label}
          </button>

          {activeFilter === filter.key && (
            <div className={styles.filterList}>
              {filter.items.map((item) => (
                <button
                  type="button"
                  className={styles.filterItem}
                  key={item}
                  onClick={() => {
                    // По заданию пока только открываем список.
                    // Фильтрацию добавим в следующей работе.
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
