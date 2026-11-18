
'use client';

import Track from '@/components/Track/Track';
import type { Track as TrackData } from '@/api/api';
import styles from './Playlist.module.css';

type PlaylistProps = {
  tracks: TrackData[];
  currentTrackId: number | null;
  isPlaying: boolean;
  onTrackSelect: (track: TrackData) => void;
  favoriteTracks: TrackData[];
  onToggleFavorite: (track: TrackData) => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function Playlist({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackSelect,
  favoriteTracks,
  onToggleFavorite,
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
        {tracks.map((track) => (
          <Track
            key={track._id}
            title={track.name}
            author={track.author}
            album={track.album}
            time={formatDuration(track.duration_in_seconds)}
            isActive={currentTrackId === track._id}
            isPlaying={currentTrackId === track._id && isPlaying}
            isFavorite={favoriteTracks.some(
              (favoriteTrack) => favoriteTrack._id === track._id,
            )}
            onSelect={() => onTrackSelect(track)}
            onToggleFavorite={() => onToggleFavorite(track)}
          />
        ))}
      </div>
    </div>
  );
}
