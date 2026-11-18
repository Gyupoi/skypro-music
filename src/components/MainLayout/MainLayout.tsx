'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { useRouter } from 'next/navigation';

import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Player from '@/components/Player/Player';

import {
  getFavoriteTracks,
  addTrackToFavorite,
  removeTrackFromFavorite,
  type Track,
} from '@/api/api';

import '../../app/page.css';

type MusicPlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  isShuffle: boolean;
  favoriteTracks: Track[];
  setQueue: (tracks: Track[]) => void;
  onTrackSelect: (track: Track) => void;
  toggleFavorite: (track: Track) => Promise<void>;
  clearFavorites: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error('useMusicPlayer должен использоваться внутри MainLayout');
  }

  return context;
}

function shuffleTracks(tracks: Track[]): Track[] {
  const shuffled = [...tracks];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();

  const [queue, setQueueState] = useState<Track[]>([]);
  const [playbackOrder, setPlaybackOrder] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);

  const clearFavorites = useCallback(() => {
    setFavoriteTracks([]);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('access');

    if (!accessToken) {
      setFavoriteTracks([]);
      return;
    }

    let isMounted = true;

    async function loadFavorites() {
      try {
        const favorites = await getFavoriteTracks();

        if (isMounted) {
          setFavoriteTracks(favorites);
        }
      } catch (error) {
        console.error('Не удалось загрузить избранное:', error);
      }
    }

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const setQueue = useCallback((tracks: Track[]) => {
    setQueueState(tracks);
    setPlaybackOrder(tracks);
    setIsShuffle(false);
  }, []);

  const toggleFavorite = useCallback(
    async (track: Track) => {
      const accessToken = localStorage.getItem('access');

      if (!accessToken) {
        router.push('/auth/signin');
        return;
      }

      const isFavorite = favoriteTracks.some(
        (favoriteTrack) => favoriteTrack._id === track._id,
      );

      if (isFavorite) {
        await removeTrackFromFavorite(track._id);

        setFavoriteTracks((previous) =>
          previous.filter((item) => item._id !== track._id),
        );
      } else {
        await addTrackToFavorite(track._id);

        setFavoriteTracks((previous) => [...previous, track]);
      }
    },
    [favoriteTracks, router],
  );

  const handleNextTrack = useCallback(() => {
    if (!currentTrack) return;

    const currentIndex = playbackOrder.findIndex(
      (track) => track._id === currentTrack._id,
    );

    if (currentIndex >= 0 && currentIndex < playbackOrder.length - 1) {
      setCurrentTrack(playbackOrder[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, playbackOrder]);

  const handlePrevTrack = useCallback(() => {
    if (!currentTrack) return;

    const currentIndex = playbackOrder.findIndex(
      (track) => track._id === currentTrack._id,
    );

    if (currentIndex > 0) {
      setCurrentTrack(playbackOrder[currentIndex - 1]);
    }
  }, [currentTrack, playbackOrder]);

  const handleShuffle = useCallback(() => {
    if (isShuffle) {
      setPlaybackOrder(queue);
      setIsShuffle(false);
      return;
    }

    const remainingTracks = queue.filter(
      (track) => track._id !== currentTrack?._id,
    );

    const shuffled = shuffleTracks(remainingTracks);

    setPlaybackOrder(currentTrack ? [currentTrack, ...shuffled] : shuffled);
    setIsShuffle(true);
  }, [isShuffle, queue, currentTrack]);

  const currentTrackIsFavorite = currentTrack
    ? favoriteTracks.some((track) => track._id === currentTrack._id)
    : false;

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isShuffle,
        favoriteTracks,
        setQueue,
        onTrackSelect: setCurrentTrack,
        toggleFavorite,
        clearFavorites,
      }}
    >
      <div className="wrapper">
        <div className="container">
          <main className="main">
            <Navigation />

            <div className="centerblock">{children}</div>

            <Sidebar />
          </main>

          <Player
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            isShuffle={isShuffle}
            onShuffleChange={handleShuffle}
            isFavorite={currentTrackIsFavorite}
            onToggleFavorite={() => {
              if (currentTrack) {
                void toggleFavorite(currentTrack);
              }
            }}
          />

          <footer className="footer"></footer>
        </div>
      </div>
    </MusicPlayerContext.Provider>
  );
}
