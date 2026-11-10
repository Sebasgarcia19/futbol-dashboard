    function StatsPanel({ stats, darkMode, children }) {
  const maxCount = Math.max(1, ...Object.values(stats.byPosition));

  return (
    <section className={`stats-panel ${darkMode ? 'stats-panel--dark' : ''}`}>
      <div className="stats-panel__grid">
        <article className="stats-panel__card stats-panel__card--main">
          <span className="stats-panel__label">Jugadores en tabla</span>
          <strong className="stats-panel__value">{stats.total}</strong>
          <span className="stats-panel__badge">Favoritos: {stats.favoritesCount}</span>
        </article>

        <article className="stats-panel__card">
          <span className="stats-panel__label">Promedio de goles</span>
          <strong className="stats-panel__value">{stats.avgGoals}</strong>
          <span className="stats-panel__sub">Total goles: {stats.totalGoals}</span>
        </article>

        <article className="stats-panel__card">
          <span className="stats-panel__label">Promedio de edad</span>
          <strong className="stats-panel__value">{stats.avgAge} años</strong>
          <span className="stats-panel__sub">Total asistencias: {stats.totalAssists}</span>
        </article>

        <article className="stats-panel__card stats-panel__card--dark">
          <span className="stats-panel__label">Máximo goleador</span>
          <strong className="stats-panel__name">{stats.topScorer}</strong>
        </article>

        <article className="stats-panel__card">{children}</article>
      </div>

      <div className="stats-panel__positions">
        <span className="stats-panel__label">Distribución por posición</span>
        {Object.entries(stats.byPosition).map(([position, count]) => (
          <div key={position} className="stats-panel__bar-row">
            <span className="stats-panel__bar-name">{position}</span>
            <div className="stats-panel__bar-track">
              <div className="stats-panel__bar" style={{ width: `${(count / maxCount) * 100}%` }} />
            </div>
            <span className="stats-panel__bar-count">{count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsPanel;