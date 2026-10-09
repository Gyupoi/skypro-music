import Sidebar from '@/components/Sidebar/Sidebar';
import Navigation from '@/components/Navigation/Navigation';
import Search from '@/components/Search/Search';
import Filters from '@/components/Filters/Filters';
import Playlist from '@/components/Playlist/Playlist';
import Player from '@/components/Player/Player';
import './page.css';

export default function Home() {
  return (
    <div className={'wrapper'}>
      <div className={'container'}>
        <main className={'main'}>
          <Navigation />
          <div className={'centerblock'}>
            <Search />
            <h2 className={'centerblock__h2'}>Треки</h2>
            <Filters />
            <Playlist />
          </div>
          <Sidebar />
        </main>
        <Player />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
