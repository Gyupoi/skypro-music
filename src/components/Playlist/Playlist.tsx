'use client';

import Track from '@/components/Track/Track';
import { data } from '../../../data';
import styles from './Playlist.module.css';

type TrackData = (typeof data)[number];

type PlaylistProps = {
  currentTrackId: number | null;
  isPlaying: boolean;
  onTrackSelect: (track: TrackData) => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function Playlist({
  currentTrackId,
  isPlaying,
  onTrackSelect,
}: PlaylistProps) {
  return (
    <div className={styles.centerblockContent}>
      <div className={styles.contentTitle}>
        <div className={`${styles.playlistTitleCol} ${styles.col01}`}>Трек</div>

        <div className={`${styles.playlistTitleCol} ${styles.col02}`}>
          Исполнитель
        </div>

        <div className={`${styles.playlistTitleCol} ${styles.col03}`}>
          Альбом
        </div>

        <div className={`${styles.playlistTitleCol} ${styles.col04}`}>
          <svg className={styles.playlistTitleSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
          </svg>
        </div>
      </div>

      <div className={styles.contentPlaylist}>
        {data.map((track) => (
          <Track
            key={track._id}
            title={track.name}
            author={track.author}
            album={track.album}
            time={formatDuration(track.duration_in_seconds)}
            isActive={currentTrackId === track._id}
            isPlaying={currentTrackId === track._id && isPlaying}
            onSelect={() => onTrackSelect(track)}
          />
        ))}
      </div>
    </div>
  );
}
