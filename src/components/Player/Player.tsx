'use client';

import { useEffect, useRef } from 'react';
import styles from './Player.module.css';
import { data } from '../../../data';

type TrackData = (typeof data)[number];

type PlayerProps = {
  currentTrack: TrackData | null;
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
};

export default function Player({
  currentTrack,
  isPlaying,
  onPlayingChange,
}: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) return;

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

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
        onEnded={() => onPlayingChange(false)}
      />

      <div className={styles.barContent}>
        <div className={styles.barPlayerProgress}></div>

        <div className={styles.barPlayerBlock}>
          <div className={styles.barPlayer}>
            <div className={styles.playerControls}>
              <div className={styles.playerBtnPrev}>
                <svg className={styles.playerBtnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              <button
                type="button"
                className={`${styles.playerBtnPlay} ${styles.btn}`}
                onClick={togglePlay}
                disabled={!currentTrack}
                aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
              >
                <svg className={styles.playerBtnPlaySvg}>
                  <use
                    xlinkHref={`/img/icon/sprite.svg#${
                      isPlaying ? 'icon-pause' : 'icon-play'
                    }`}
                  ></use>
                </svg>
              </button>

              <div className={styles.playerBtnNext}>
                <svg className={styles.playerBtnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              <div className={`${styles.playerBtnRepeat} ${styles.btnIcon}`}>
                <svg className={styles.playerBtnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              <div className={`${styles.playerBtnShuffle} ${styles.btnIcon}`}>
                <svg className={styles.playerBtnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.playerTrackPlay}>
              <div className={styles.trackPlayContain}>
                <div className={styles.trackPlayImage}>
                  <svg className={styles.trackPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>

                <div className={styles.trackPlayAuthor}>
                  <span className={styles.trackPlayAuthorLink}>
                    {currentTrack?.name ?? 'Выберите трек'}
                  </span>
                </div>

                <div className={styles.trackPlayAlbum}>
                  <span className={styles.trackPlayAlbumLink}>
                    {currentTrack?.author ?? 'Исполнитель'}
                  </span>
                </div>
              </div>

              <div className={styles.trackPlayLikeDis}>
                <div className={`${styles.btnIcon} ${styles.trackPlayLike}`}>
                  <svg className={styles.trackPlayLikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>

                <div className={`${styles.btnIcon} ${styles.trackPlayDislike}`}>
                  <svg className={styles.trackPlayDislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.barVolumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>

              <div className={`${styles.volumeProgress} ${styles.btn}`}>
                <input
                  className={`${styles.volumeProgressLine} ${styles.btn}`}
                  type="range"
                  name="range"
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
