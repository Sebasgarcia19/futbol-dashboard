function SearchHistory({ history, onSelectSearch, onClearHistory }) {
  return (
    <div className="search-history">
      <div className="search-history__header">
        <span className="search-history__title">Historial de búsqueda</span>
        {history.length > 0 && (
          <button className="search-history__clear" onClick={onClearHistory}>Limpiar</button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="search-history__empty">Aún no hay búsquedas recientes.</p>
      ) : (
        <div className="search-history__list">
          {history.map((term) => (
            <button key={term} className="search-history__chip" onClick={() => onSelectSearch(term)}>
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchHistory;