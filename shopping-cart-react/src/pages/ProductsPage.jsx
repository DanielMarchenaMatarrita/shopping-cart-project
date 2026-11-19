import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import ItemDetails from "../components/ItemDetails";
import ItemGrid from "../components/ItemGrid";
import PaginationControls from "../components/PaginationControls";
import { categories } from "../data/categories";
import { storeCatalog } from "../data/storeCatalog";
import { useCart } from "../features/cart/useCart";
import { usePagination } from "../hooks/usePagination";
import { useProducts } from "../hooks/useProducts";

const PAGE_SIZE = 12;

function parseCategory(searchParams) {
    const categoryId = searchParams.get("category") ?? "all";
    const isKnownCategory = categories.some(
        (category) => category.id === categoryId
    );

    return isKnownCategory ? categoryId : "all";
}

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedItem, setSelectedItem] = useState(null);
    const location = useLocation();
    const { addItem } = useCart();

    const search = searchParams.get("search") ?? "";
    const categoryId = parseCategory(searchParams);

    const { currentPage, setTotalPages } = usePagination();

    // Links such as the empty-cart call to action use /products#demo-store.
    useEffect(() => {
        if (location.hash !== "#demo-store") return;

        document
            .getElementById("demo-store")
            ?.scrollIntoView({ block: "start" });
    }, [location.hash]);

    const { products, pagination, loading, error } = useProducts({
        search,
        categoryId,
        page: currentPage,
        limit: PAGE_SIZE,
    });

    // Sync the page count with the shared pagination state. The provider
    // clamps currentPage if the new result set is shorter.
    useLayoutEffect(() => {
        if (!pagination) return;

        setTotalPages(pagination.totalPages);
    }, [pagination, setTotalPages]);

    function updateFilters({ search: nextSearch, categoryId: nextCategory }) {
        setSearchParams(
            (previousParams) => {
                const params = new URLSearchParams(previousParams);
                const searchValue =
                    nextSearch ?? previousParams.get("search") ?? "";
                const categoryValue =
                    nextCategory ?? previousParams.get("category") ?? "all";

                if (searchValue) {
                    params.set("search", searchValue);
                } else {
                    params.delete("search");
                }

                if (categoryValue && categoryValue !== "all") {
                    params.set("category", categoryValue);
                } else {
                    params.delete("category");
                }

                // Filters always restart the catalog on page 1. Doing this in
                // the same URL update keeps one source of truth and avoids an
                // intermediate fetch for the old page.
                params.delete("page");

                return params;
            },
            { replace: true }
        );
    }

    function handleSearchChange(event) {
        updateFilters({ search: event.target.value });
    }

    function handleCategoryChange(event) {
        updateFilters({ categoryId: event.target.value });
    }

    const showResults = !loading && !error;
    const firstVisible = pagination
        ? (pagination.page - 1) * pagination.limit + 1
        : 0;
    const lastVisible = pagination
        ? Math.min(pagination.page * pagination.limit, pagination.total)
        : 0;

    return (
        <main className="catalog-page">
            <header className="catalog-intro">
                <p className="eyebrow">Tropical Fruits &amp; Veggies SA</p>
                <h1>Agricultural reference catalog</h1>
                <p>
                    Browse CENADA and PIMA historical references. These entries
                    document catalog data only; they do not represent current
                    stock, prices, or retail availability.
                </p>
            </header>

            <section
                id="demo-store"
                className="demo-store"
                aria-labelledby="demo-store-title"
            >
                <div className="demo-store__heading">
                    <div>
                        <p className="eyebrow">Shopping cart demo</p>
                        <h2 id="demo-store-title">Demo store</h2>
                    </div>
                    <span className="demo-store__tag">Fictional data</span>
                </div>
                <p className="demo-store__notice">
                    These five products and their CRC prices are invented for
                    testing the shopping cart. They are not real Tropical Fruits
                    &amp; Veggies inventory, offers, or availability.
                </p>

                <ItemGrid
                    items={storeCatalog}
                    mode="store"
                    label="Fictional demo store products"
                    onViewDetails={setSelectedItem}
                    onAddToCart={addItem}
                />
            </section>

            <section aria-labelledby="reference-catalog-title">
                <div className="catalog-section-heading">
                    <p className="eyebrow">Research data</p>
                    <h2 id="reference-catalog-title">Reference catalog</h2>
                </div>
                <p className="catalog-section-note">
                    Reference-only entries cannot be added to the cart.
                </p>

                <form
                    className="catalog-filters"
                    role="search"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <div className="filter-field">
                        <label htmlFor="catalog-search">Search products</label>
                        <input
                            id="catalog-search"
                            type="search"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search by product name…"
                            autoComplete="off"
                        />
                    </div>

                    <div className="filter-field">
                        <label htmlFor="catalog-category">Category</label>
                        <select
                            id="catalog-category"
                            value={categoryId}
                            onChange={handleCategoryChange}
                        >
                            <option value="all">All categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>

                {loading && (
                    <p className="catalog-status" role="status">
                        Loading products…
                    </p>
                )}

                {error && (
                    <p
                        className="catalog-status catalog-status--error"
                        role="alert"
                    >
                        Unable to load the catalog. Please try again.
                    </p>
                )}

                {showResults && (
                    <>
                        <p className="catalog-count" aria-live="polite">
                            {pagination && pagination.total > 0
                                ? `Showing ${firstVisible}–${lastVisible} of ${pagination.total} products`
                                : "No matching products"}
                        </p>

                        <ItemGrid
                            items={products}
                            mode="reference"
                            onViewDetails={setSelectedItem}
                        />

                        <PaginationControls />
                    </>
                )}
            </section>

            {selectedItem && (
                <ItemDetails
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </main>
    );
}
