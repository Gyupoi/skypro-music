'use client';

import Link from 'next/link';
import styles from './Track.module.css';

type TrackProps = {
  title: string;
  titleSpan?: string;
  author: string;
  album: string;
  time: string;
  isActive: boolean;
  isPlaying: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
};

export default function Track({
  title,
  titleSpan,
  author,
  album,
  time,
  isActive,
  isPlaying,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: TrackProps) {
  return (
    <div
      className={`${styles.playlistItem} ${
        isActive ? styles.playlistItemActive : ''
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className={styles.playlistTrack}>
        <div className={styles.trackTitle}>
          <div className={styles.trackTitleImage}>
            {isActive ? (
              <span
                className={`${styles.playingDot} ${
                  isPlaying ? styles.playingDotAnimated : ''
                }`}
              />
            ) : (
              <svg className={styles.trackTitleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>

          <div>
            <Link
              className={styles.trackTitleLink}
              href="#"
              onClick={(event) => event.preventDefault()}
            >
              {title}
              {titleSpan && (
                <span className={styles.trackTitleSpan}>{titleSpan}</span>
              )}
            </Link>
          </div>
        </div>

        <div className={styles.trackAuthor}>
          <Link
            className={styles.trackAuthorLink}
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            {author}
          </Link>
        </div>

        <div className={styles.trackAlbum}>
          <Link
            className={styles.trackAlbumLink}
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            {album}
          </Link>
        </div>

        <div className={styles.trackTime}>
          <button
            type="button"
            aria-label={
              isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
            }
            aria-pressed={isFavorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <svg
              className={styles.trackTimeSvg}
              style={{
                fill: isFavorite ? '#b672ff' : 'none',
                stroke: isFavorite ? '#b672ff' : 'currentColor',
              }}
            >
              <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
            </svg>
          </button>

          <span className={styles.trackTimeText}>{time}</span>
        </div>
      </div>
    </div>
  );
}
