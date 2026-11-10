function Modal({ isOpen, onClose, player, darkMode, isFavorite, onToggleFavorite }) {
  if (!player) return null;

  return (
    <div
      className={`modal ${isOpen ? 'modal--open' : ''} ${darkMode ? 'modal--dark' : ''}`}
      onClick={onClose}
    >
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="modal__x" onClick={onClose} aria-label="Cerrar">✕</button>
        <h2 className="modal__title">{player.name}</h2>
        <span className="modal__badge">{player.position}</span>

        <button className="modal__fav" onClick={() => onToggleFavorite(player.id)}>
          {isFavorite ? '★ Favorito' : '☆ Favorito'}
        </button>

        <dl className="modal__grid">
          <div><dt>Club</dt><dd>{player.club}</dd></div>
          <div><dt>País</dt><dd>{player.country}</dd></div>
          <div><dt>Edad</dt><dd>{player.age} años</dd></div>
          <div><dt>Goles</dt><dd>{player.goals}</dd></div>
          <div><dt>Asistencias</dt><dd>{player.assists}</dd></div>
          <div><dt>Rating</dt><dd className="modal__rating">{player.rating.toFixed(1)}</dd></div>
        </dl>

        <button className="modal__close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default Modal;