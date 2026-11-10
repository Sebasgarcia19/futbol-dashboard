function SearchBar({ value, onChange, onClear, resultsCount }) {
  return (
    <section className="search-bar">
      <label className="search-bar__label" htmlFor="search">Buscar jugadores</label>
      <div className="search-bar__field">
        <span className="search-bar__icon">🔍</span>
        <input
          id="search"
          className="search-bar__input"
          type="text"
          placeholder="Escribe el nombre de un jugador..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button className="search-bar__x" onClick={onClear} aria-label="Borrar búsqueda">✕</button>
        )}
        <button className="search-bar__clear" onClick={onClear}>Limpiar</button>
      </div>
      <p className="search-bar__count">Mostrando {resultsCount} resultados</p>
    </section>
  );
}

export default SearchBar;