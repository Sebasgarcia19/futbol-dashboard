function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, totalItems }) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const first = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const last = Math.min(totalPages, first + 4);
  const pages = [];
  for (let p = first; p <= last; p++) pages.push(p);

  return (
    <div className="pagination">
      <div className="pagination__size">
        <label htmlFor="per-page" className="pagination__label">Mostrar</label>
        <select
          id="per-page"
          className="pagination__select"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
        <span className="pagination__info">Mostrando {start}-{end} de {totalItems} registros</span>
      </div>

      <div className="pagination__nav">
        <button className="pagination__btn" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          « Primera
        </button>
        <button className="pagination__btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          ‹ Anterior
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__btn ${p === currentPage ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button className="pagination__btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente ›
        </button>
        <button className="pagination__btn" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
          Última »
        </button>
      </div>
    </div>
  );
}

export default Pagination;