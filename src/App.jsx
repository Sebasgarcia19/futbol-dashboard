import { useState, useEffect, useMemo } from 'react';
import { players } from './data/players';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import StatsPanel from './components/StatsPanel';
import PlayerTable from './components/PlayerTable';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import './App.css';

function App() {
  // Búsqueda + debounce + historial
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // Tabla
  const [rowColors, setRowColors] = useState('none'); // 'none' | 'pares' | 'impares'
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Preferencias persistentes
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([1, 2, 3, 4]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Modal
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1) Debounce de 300 ms con cleanup
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2) Carga inicial desde localStorage (array vacío)
  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark) setDarkMode(JSON.parse(savedDark));

    const savedFavs = localStorage.getItem('favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  // 3) Guardado en localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // 4) Historial: últimas 5 búsquedas (más de 2 letras)
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 2) {
      setSearchHistory((prev) => {
        const updated = [debouncedSearch, ...prev.filter((s) => s !== debouncedSearch)];
        return updated.slice(0, 5);
      });
    }
  }, [debouncedSearch]);

  // 5) La paginación se reinicia al filtrar o cambiar el tamaño
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, showOnlyFavorites, itemsPerPage]);

  // Filtrado (solo por nombre) + favoritos
  const filteredPlayers = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return players.filter((p) => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchFav = !showOnlyFavorites || favorites.includes(p.id);
      return matchName && matchFav;
    });
  }, [debouncedSearch, showOnlyFavorites, favorites]);

  // Ordenamiento
  const sortedPlayers = useMemo(() => {
    if (!sortConfig.key || sortConfig.direction === 'none') return filteredPlayers;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return [...filteredPlayers].sort((a, b) => {
      const x = a[sortConfig.key];
      const y = b[sortConfig.key];
      if (typeof x === 'number') return (x - y) * dir;
      return String(x).localeCompare(String(y), 'es') * dir;
    });
  }, [filteredPlayers, sortConfig]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(sortedPlayers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const visiblePlayers = sortedPlayers.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Estadísticas en tiempo real
  const stats = useMemo(() => {
    const total = filteredPlayers.length;
    const totalGoals = filteredPlayers.reduce((s, p) => s + p.goals, 0);
    const totalAssists = filteredPlayers.reduce((s, p) => s + p.assists, 0);
    const totalAge = filteredPlayers.reduce((s, p) => s + p.age, 0);
    const top = filteredPlayers.reduce((best, p) => (!best || p.goals > best.goals ? p : best), null);
    const byPosition = filteredPlayers.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      favoritesCount: filteredPlayers.filter((p) => favorites.includes(p.id)).length,
      avgGoals: total ? (totalGoals / total).toFixed(1) : '0.0',
      avgAge: total ? Math.round(totalAge / total) : 0,
      totalGoals,
      totalAssists,
      topScorer: top ? top.name : '—',
      byPosition,
    };
  }, [filteredPlayers, favorites]);

  // Handlers
  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
  };

  const handleSelectSearch = (term) => {
    setSearchTerm(term);
    setDebouncedSearch(term);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: 'none' };
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const openModal = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={`app ${darkMode ? 'app--dark' : ''}`}>
      <header className="header">
        <div className="header__inner">
          <div>
            <p className="header__eyebrow">Top Club Soccer</p>
            <h1 className="header__title">Dashboard de Jugadores</h1>
            <p className="header__subtitle">
              Gestiona tus estrellas favoritas, analiza estadísticas y descubre talentos.
            </p>
          </div>
          <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((d) => !d)} />
        </div>
      </header>

      <main className="dashboard">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClearSearch}
          resultsCount={filteredPlayers.length}
        />

        <StatsPanel stats={stats} darkMode={darkMode}>
          <SearchHistory
            history={searchHistory}
            onSelectSearch={handleSelectSearch}
            onClearHistory={() => setSearchHistory([])}
          />
        </StatsPanel>

        <div className="toolbar">
          <button className="toolbar__btn" onClick={() => setRowColors('pares')}>
            Pintar filas pares
          </button>
          <button className="toolbar__btn" onClick={() => setRowColors('impares')}>
            Pintar filas impares
          </button>
          <button className="toolbar__btn toolbar__btn--ghost" onClick={() => setRowColors('none')}>
            Limpiar color
          </button>

          <button
            className={`toolbar__btn ${showOnlyFavorites ? 'toolbar__btn--active' : ''}`}
            onClick={() => setShowOnlyFavorites((v) => !v)}
          >
            ★ Mostrar solo favoritos
          </button>
          <span className="toolbar__count">{favorites.length} favoritos guardados</span>
        </div>

        <PlayerTable
          players={visiblePlayers}
          favorites={favorites}
          onRowClick={openModal}
          onToggleFavorite={toggleFavorite}
          onSort={handleSort}
          sortConfig={sortConfig}
          darkMode={darkMode}
          rowColors={rowColors}
        />

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={sortedPlayers.length}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        player={selectedPlayer}
        darkMode={darkMode}
        isFavorite={selectedPlayer ? favorites.includes(selectedPlayer.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;