import PlayerRow from './PlayerRow';

const columns = [
  { key: 'name', label: 'Jugador' },
  { key: 'club', label: 'Club' },
  { key: 'position', label: 'Posición' },
  { key: 'country', label: 'País' },
  { key: 'age', label: 'Edad' },
  { key: 'goals', label: 'Goles' },
  { key: 'assists', label: 'Asistencias' },
  { key: 'rating', label: 'Rating' },
];

function PlayerTable({ players, favorites, onRowClick, onToggleFavorite, onSort, sortConfig, darkMode, rowColors }) {
  const getArrow = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getColorClass = (index) => {
    const position = index + 1;
    if (rowColors === 'pares' && position % 2 === 0) return 'player-row--pares';
    if (rowColors === 'impares' && position % 2 === 1) return 'player-row--impares';
    return '';
  };

  return (
    <div className={`player-table ${darkMode ? 'player-table--dark' : ''}`}>
      <table className="player-table__table">
        <thead>
          <tr>
            <th>Fav</th>
            {columns.map((col) => (
              <th key={col.key}>
                {col.label}
                <button className="player-table__sort" onClick={() => onSort(col.key)}>
                  {getArrow(col.key)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.length === 0 ? (
            <tr>
              <td colSpan={9} className="player-table__empty">No se encontraron jugadores</td>
            </tr>
          ) : (
            players.map((player, index) => (
              <PlayerRow
                key={player.id}
                player={player}
                index={index}
                onClick={onRowClick}
                isFavorite={favorites.includes(player.id)}
                onToggleFavorite={onToggleFavorite}
                darkMode={darkMode}
                colorClass={getColorClass(index)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerTable;