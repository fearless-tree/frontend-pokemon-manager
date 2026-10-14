function getPaginationPages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationPages(page, totalPages);

  function goToPage(pageNumber) {
    onPageChange(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <nav className="mt-4" aria-label="Paginanavigatie">
      <ul className="pagination justify-content-center">
        <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
          <button
            className="page-link"
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Vorige pagina"
          >
            &lt;
          </button>
        </li>

        {pages.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <li key={`dots-${index}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            );
          }

          return (
            <li key={pageNumber} className={`page-item${page === pageNumber ? ' active' : ''}`}>
              <button
                type="button"
                onClick={() => goToPage(pageNumber)}
                className="page-link"
                aria-current={page === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
          <button
            className="page-link"
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Volgende pagina"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
