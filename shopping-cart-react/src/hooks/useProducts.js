import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export function useProducts({
    search = "",
    categoryId = "all",
    page = 1,
    limit = 12,
} = {}) {
    const [refreshToken, setRefreshToken] = useState(0);
    const [result, setResult] = useState({
        requestKey: null,
        products: [],
        pagination: null,
        error: null,
    });

    const requestKey = JSON.stringify([
        search,
        categoryId,
        page,
        limit,
        refreshToken,
    ]);

    useEffect(() => {
        let active = true;

        getProducts({ search, categoryId, page, limit })
            .then((response) => {
                if (!active) return;

                setResult({
                    requestKey,
                    products: response.data,
                    pagination: response.pagination,
                    error: null,
                });
            })
            .catch((err) => {
                if (!active) return;

                setResult({
                    requestKey,
                    products: [],
                    pagination: null,
                    error: err,
                });
            });

        return () => {
            active = false;
        };
    }, [requestKey, search, categoryId, page, limit]);

    const refresh = useCallback(() => {
        setRefreshToken((token) => token + 1);
    }, []);

    // Derived state: a result that belongs to a previous request means the
    // current request is still in flight. No synchronous setState in effects.
    const loading = result.requestKey !== requestKey;

    return {
        products: result.products,
        pagination: result.pagination,
        loading,
        error: loading ? null : result.error,
        refresh,
    };
}
