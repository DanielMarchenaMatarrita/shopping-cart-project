import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { PaginationContext } from "./paginationContext";

const PAGE_PARAM = "page";

function parsePage(searchParams) {
    const rawPage = Number(searchParams.get(PAGE_PARAM));

    return Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
}

export default function PaginationProvider({ children }) {
    // The URL owns the current page. Context exposes navigation operations
    // instead of keeping a second, competing page state.
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parsePage(searchParams);
    const [totalPages, setTotalPagesState] = useState(null);

    const setTotalPages = useCallback((nextTotalPages) => {
        const safeTotal = Math.max(
            0,
            Math.trunc(Number(nextTotalPages)) || 0
        );

        setTotalPagesState(safeTotal);
    }, []);

    const goToPage = useCallback(
        (nextPage, { replace = false } = {}) => {
            const lastPage = Math.max(1, totalPages ?? 1);
            const requested = Math.trunc(Number(nextPage));
            const safePage = Math.min(
                Math.max(1, Number.isFinite(requested) ? requested : 1),
                lastPage
            );

            if (safePage === currentPage) return;

            setSearchParams(
                (previousParams) => {
                    const params = new URLSearchParams(previousParams);

                    if (safePage === 1) {
                        params.delete(PAGE_PARAM);
                    } else {
                        params.set(PAGE_PARAM, String(safePage));
                    }

                    return params;
                },
                { replace }
            );
        },
        [currentPage, setSearchParams, totalPages]
    );

    const nextPage = useCallback(
        () => goToPage(currentPage + 1),
        [currentPage, goToPage]
    );

    const prevPage = useCallback(
        () => goToPage(currentPage - 1),
        [currentPage, goToPage]
    );

    const resetPage = useCallback(
        () => goToPage(1, { replace: true }),
        [goToPage]
    );

    // A direct link or a filter change can leave an out-of-range page in the
    // URL. Replace it with the last valid page once the result set is known.
    useEffect(() => {
        if (totalPages === null) return;

        const lastPage = Math.max(1, totalPages);

        if (currentPage <= lastPage) return;

        setSearchParams(
            (previousParams) => {
                const params = new URLSearchParams(previousParams);

                if (lastPage === 1) {
                    params.delete(PAGE_PARAM);
                } else {
                    params.set(PAGE_PARAM, String(lastPage));
                }

                return params;
            },
            { replace: true }
        );
    }, [currentPage, setSearchParams, totalPages]);

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
