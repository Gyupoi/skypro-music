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
  onSelect: () => void;
};

export default function Track({
  title,
  titleSpan,
  author,
  album,
  time,
  isActive,
  isPlaying,
  onSelect,
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
            {isActive && isPlaying ? (
              <span className={styles.playingIndicator}>Ⅱ</span>
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
          <svg className={styles.trackTimeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>

          <span className={styles.trackTimeText}>{time}</span>
        </div>
      </div>
    </div>
  );
}
