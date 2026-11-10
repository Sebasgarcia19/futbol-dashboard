function PlayerRow({ player, index, onClick, isFavorite, onToggleFavorite, darkMode, colorClass }) {
  return (
    <tr
      className={`player-row ${colorClass} ${darkMode ? 'player-row--dark' : ''}`}
      data-row={index + 1}
      onClick={() => onClick(player)}
    >
      <td>
        <button
          className={`player-row__star ${isFavorite ? 'player-row__star--on' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(player.id);
          }}
          aria-label="Marcar favorito"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </td>
      <td className="player-row__name">{player.name}</td>
      <td>{player.club}</td>
      <td>{player.position}</td>
      <td>{player.country}</td>
      <td className="player-row__num">{player.age}</td>
      <td className="player-row__num">{player.goals}</td>
      <td className="player-row__num">{player.assists}</td>
      <td className="player-row__num">{player.rating.toFixed(1)}</td>
    </tr>
  );
}

export default PlayerRow;