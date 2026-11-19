import { useLayoutEffect, useState } from "react";
import ItemDetails from "../components/ItemDetails";
import ItemGrid from "../components/ItemGrid";
import PaginationControls from "../components/PaginationControls";
import { categories } from "../data/categories";
import { usePagination } from "../hooks/usePagination";
import { useProducts } from "../hooks/useProducts";

const PAGE_SIZE = 12;

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);

    const { currentPage, setTotalPages, resetPage } = usePagination();

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

    function handleSearchChange(event) {
        setSearch(event.target.value);
        resetPage();
    }

    function handleCategoryChange(event) {
        setCategoryId(event.target.value);
        resetPage();
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
                <p className="catalog-status catalog-status--error" role="alert">
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

            {selectedItem && (
                <ItemDetails
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </main>
    );
}
