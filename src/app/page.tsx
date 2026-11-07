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

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        />

        <footer className="footer"></footer>
      </div>
    </div>
  );
}
