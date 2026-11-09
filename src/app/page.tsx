'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navigation from '@/components/Navigation/Navigation';
import Search from '@/components/Search/Search';
import Filters from '@/components/Filters/Filters';
import Playlist from '@/components/Playlist/Playlist';
import Player from '@/components/Player/Player';
import { data } from '../../data';
import './page.css';

type TrackData = (typeof data)[number];

function shuffleTracks(tracks: TrackData[]): TrackData[] {
  const shuffled = [...tracks];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackOrder, setPlaybackOrder] = useState<TrackData[]>(data);

  const handleNextTrack = () => {
    if (!currentTrack) return;

    const currentIndex = playbackOrder.findIndex(
      (track) => track._id === currentTrack._id,
    );

    if (currentIndex >= 0 && currentIndex < playbackOrder.length - 1) {
      setCurrentTrack(playbackOrder[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevTrack = () => {
    if (!currentTrack) return;

    const currentIndex = playbackOrder.findIndex(
      (track) => track._id === currentTrack._id,
    );

    if (currentIndex > 0) {
      setCurrentTrack(playbackOrder[currentIndex - 1]);
    }
  };

  const handleShuffle = () => {
    if (isShuffle) {
      setPlaybackOrder(data);
      setIsShuffle(false);
      return;
    }

    const remainingTracks = data.filter(
      (track) => track._id !== currentTrack?._id,
    );

    const shuffled = shuffleTracks(remainingTracks);

    setPlaybackOrder(currentTrack ? [currentTrack, ...shuffled] : shuffled);
    setIsShuffle(true);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Navigation />

          <div className="centerblock">
            <Search />
            <h2 className="centerblock__h2">Треки</h2>
            <Filters />

            <Playlist
              currentTrackId={currentTrack?._id ?? null}
              isPlaying={isPlaying}
              onTrackSelect={setCurrentTrack}
            />
          </div>

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
        />

        <footer className="footer"></footer>
      </div>
    </div>
  );
}
