import { usePagination } from "../hooks/usePagination";

export default function PaginationControls() {
    const { currentPage, totalPages, nextPage, prevPage } = usePagination();

    // Nothing to paginate (initial load, empty results, or an invalid page
    // that is being corrected in the URL).
    if (totalPages === null || totalPages < 1 || currentPage > totalPages) {
        return null;
    }

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    return (
        <nav className="pagination" aria-label="Catalog pagination">
            <button
                type="button"
                className="pagination__button"
                onClick={prevPage}
                disabled={isFirstPage}
                aria-label="Go to previous page"
            >
                Previous
            </button>

            <p className="pagination__status" aria-live="polite">
                Page {currentPage} of {totalPages}
            </p>

            <button
                type="button"
                className="pagination__button"
                onClick={nextPage}
                disabled={isLastPage}
                aria-label="Go to next page"
            >
                Next
            </button>
        </nav>
    );
}
