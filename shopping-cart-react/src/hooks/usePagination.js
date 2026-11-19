import { useContext } from "react";
import { PaginationContext } from "../context/paginationContext";

export function usePagination() {
    const context = useContext(PaginationContext);

    if (!context) {
        throw new Error("usePagination must be used within a PaginationProvider");
    }

    return context;
}
