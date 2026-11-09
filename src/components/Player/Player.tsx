
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Player.module.css';
import { data } from '../../../data';

type TrackData = (typeof data)[number];

type PlayerProps = {
  currentTrack: TrackData | null;
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  isShuffle: boolean;
  onShuffleChange: () => void;
};

function formatTime(time: number) {
  if (!Number.isFinite(time)) return '0:00';

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function Player({
  currentTrack,
  isPlaying,
  onPlayingChange,
  onNextTrack,
  onPrevTrack,
  isShuffle,
  onShuffleChange,
}: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) return;

    setCurrentTime(0);
    setDuration(0);

    audio.src = currentTrack.track_file;
    audio.load();

    audio.play().catch(() => {
      onPlayingChange(false);
    });
  }, [currentTrack, onPlayingChange]);

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        onPlayingChange(false);
      });
    }
  };

  const handleEnded = () => {
    const audio = audioRef.current;

    if (isRepeat && audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        onPlayingChange(false);
      });
    } else {
      onNextTrack();
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
        onEnded={handleEnded}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration)
        }
      />

      <div className={styles.barContent}>
        <div className={styles.barPlayerProgress}>
          <span className={styles.currentTime}>
            {formatTime(currentTime)}
          </span>

          <input
            className={styles.progressLine}
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            disabled={!currentTrack || duration === 0}
            style={{
              background: `linear-gradient(to right, #b672ff ${progress}%, #2e2e2e ${progress}%)`,
            }}
            aria-label="Перемотка трека"
          />

          <span className={styles.duration}>
            {formatTime(duration)}
          </span>
        </div>

        <div className={styles.barPlayerBlock}>
          <div className={styles.barPlayer}>
            <div className={styles.playerControls}>
              <button
                type="button"
                className={styles.playerBtnPrev}
                onClick={onPrevTrack}
                disabled={!currentTrack}
              >
                <svg className={styles.playerBtnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </button>

              <button
                type="button"
                className={styles.playerBtnPlay}
                onClick={togglePlay}
                disabled={!currentTrack}
              >
                <svg className={styles.playerBtnPlaySvg}>
                  <use
                    xlinkHref={
                      isPlaying
                        ? '/img/icon/sprite.svg#icon-pause'
                        : '/img/icon/sprite.svg#icon-play'
                    }
                  ></use>
                </svg>
              </button>

              <button
                type="button"
                className={styles.playerBtnNext}
                onClick={onNextTrack}
                disabled={!currentTrack}
              >
                <svg className={styles.playerBtnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.playerBtnRepeat} ${styles.btnIcon} ${
                  isRepeat ? styles.activeMode : ''
                }`}
                onClick={() => setIsRepeat(!isRepeat)}
                aria-label="Повтор трека"
                aria-pressed={isRepeat}
              >
                <svg className={styles.playerBtnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.playerBtnShuffle} ${styles.btnIcon} ${
                  isShuffle ? styles.activeMode : ''
                }`}
                onClick={onShuffleChange}
                aria-label="Перемешать треки"
                aria-pressed={isShuffle}
              >
                <svg className={styles.playerBtnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </button>
            </div>

            <div className={styles.trackPlay}>
              <div className={styles.trackPlayContain}>
                <div className={styles.trackPlayImage}>
                  <svg className={styles.trackPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>

                <div className={styles.trackPlayAuthor}>
                  <span className={styles.trackPlayAuthorLink}>
                    {currentTrack?.name ?? ''}
                  </span>
                </div>

                <div className={styles.trackPlayAlbum}>
                  <span className={styles.trackPlayAlbumLink}>
                    {currentTrack?.author ?? ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.trackPlayLike} ${styles.btnIcon}`}
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label={
                  isFavorite
                    ? 'Убрать из избранного'
                    : 'Добавить в избранное'
                }
                disabled={!currentTrack}
              >
                <svg
                  className={`${styles.trackPlayLikeSvg} ${
                    isFavorite ? styles.favoriteActive : ''
                  }`}
                >
                  <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.barVolumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>

              <div className={styles.volumeProgress}>
                <input
                  className={styles.volumeProgressLine}
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0.5"
                  onChange={(event) => {
                    if (audioRef.current) {
                      audioRef.current.volume = Number(event.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
