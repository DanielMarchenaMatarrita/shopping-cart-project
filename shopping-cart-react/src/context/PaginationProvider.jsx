import { useCallback, useState } from "react";
import { PaginationContext } from "./paginationContext";

export default function PaginationProvider({ children }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPagesState] = useState(0);

    // Called by the page once product data arrives. Keeping the clamp here
    // guarantees that no transition can leave currentPage outside the result set.
    const setTotalPages = useCallback((nextTotalPages) => {
        const safeTotal = Math.max(
            0,
            Math.trunc(Number(nextTotalPages)) || 0
        );

        setTotalPagesState(safeTotal);
        setCurrentPage((page) => Math.min(page, Math.max(1, safeTotal)));
    }, []);

    function nextPage() {
        setCurrentPage((page) => (page < totalPages ? page + 1 : page));
    }

    function prevPage() {
        setCurrentPage((page) => Math.max(1, page - 1));
    }

    function resetPage() {
        setCurrentPage(1);
    }

    return (
        <PaginationContext.Provider
            value={{
                currentPage,
                totalPages,
                setTotalPages,
                nextPage,
                prevPage,
                resetPage,
            }}
        >
            {children}
        </PaginationContext.Provider>
    );
}
