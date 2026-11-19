import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";

export function useProductDetails(id) {
    const normalizedId = typeof id === "string" ? id.trim() : "";
    const [result, setResult] = useState({
        requestId: null,
        product: null,
        error: null,
    });

    useEffect(() => {
        if (!normalizedId) return;

        let active = true;

        getProductById(normalizedId)
            .then((product) => {
                if (!active) return;

                setResult({
                    requestId: normalizedId,
                    product,
                    error: null,
                });
            })
            .catch((error) => {
                if (!active) return;

                setResult({
                    requestId: normalizedId,
                    product: null,
                    error,
                });
            });

        return () => {
            active = false;
        };
    }, [normalizedId]);

    const hasCurrentResult =
        normalizedId !== "" && result.requestId === normalizedId;
    const loading = normalizedId !== "" && !hasCurrentResult;

    return {
        product: hasCurrentResult ? result.product : null,
        loading,
        error: hasCurrentResult ? result.error : null,
    };
}
