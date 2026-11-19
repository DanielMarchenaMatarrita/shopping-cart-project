import { referenceCatalog } from "../data/referenceCatalog";
import { storeCatalog } from "../data/storeCatalog";
import { filterCatalog } from "../data/catalogSelectors";

const DEFAULT_PAGE_SIZE = 12;

function toPositiveInteger(value, fallback) {
    const number = Math.trunc(Number(value));

    return Number.isFinite(number) && number > 0 ? number : fallback;
}

export async function getProducts({
    search = "",
    categoryId = "all",
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
} = {}) {
    const safePage = toPositiveInteger(page, 1);
    const safeLimit = toPositiveInteger(limit, DEFAULT_PAGE_SIZE);

    const filteredProducts = filterCatalog(referenceCatalog, {
        query: search,
        categoryId,
    });

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / safeLimit);
    const start = (safePage - 1) * safeLimit;

    return {
        data: filteredProducts.slice(start, start + safeLimit),
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages,
            hasPrevPage: safePage > 1,
            hasNextPage: safePage < totalPages,
        },
    };
}

export async function getProductById(id) {
    const matchesId = (product) => String(product.id) === String(id);

    return (
        referenceCatalog.find(matchesId) ??
        storeCatalog.find(matchesId) ??
        null
    );
}
