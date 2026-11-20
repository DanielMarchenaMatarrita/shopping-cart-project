import { Link, useLocation, useParams } from "react-router";
import ProductInformation from "../components/ProductInformation";
import { getCategoryLabel, isPurchasable } from "../data/catalogSelectors";
import {
    getProductEmoji,
    getProductEmojiLabel,
} from "../data/productEmojis";
import { useCart } from "../features/cart/useCart";
import { useProductDetails } from "../hooks/useProductDetails";

function resolveBackTo(location) {
    const from = location.state?.from;

    if (typeof from !== "string") return "/products";

    return from === "/products" || from.startsWith("/products?")
        ? from
        : "/products";
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const { product, loading, error } = useProductDetails(id);
    const { addItem } = useCart();
    const backTo = resolveBackTo(location);
    const canPurchase = product
        ? product.isDemo === true && isPurchasable(product)
        : false;

    return (
        <main className="catalog-page product-detail">
            <nav className="product-detail__back" aria-label="Catalog navigation">
                <Link to={backTo}>← Back to catalog</Link>
            </nav>

            {loading && (
                <p className="catalog-status" role="status">
                    Loading product…
                </p>
            )}

            {!loading && error && (
                <p className="catalog-status catalog-status--error" role="alert">
                    Unable to load this product. Please try again.
                </p>
            )}

            {!loading && !error && !product && (
                <section aria-labelledby="product-missing-title">
                    <p className="eyebrow">Not found</p>
                    <h1 id="product-missing-title">Product not found</h1>
                    <p>
                        No catalog reference matches the requested product ID.
                    </p>
                    <p>
                        <Link to={backTo}>Return to the catalog</Link>
                    </p>
                </section>
            )}

            {!loading && !error && product && (
                <article>
                    <header>
                        <span
                            className="product-detail__emoji"
                            role="img"
                            aria-label={getProductEmojiLabel(product)}
                        >
                            {getProductEmoji(product)}
                        </span>
                        <p className="eyebrow">
                            {getCategoryLabel(product.categoryId)}
                            {product.isDemo ? " · Demo store" : ""}
                        </p>
                        <h1>{product.name}</h1>
                        <p className="product-detail__id">
                            {product.isDemo ? "Demo product ID" : "Reference ID"}
                            : {product.id}
                        </p>
                    </header>

                    {canPurchase && (
                        <div className="product-detail__actions">
                            <button
                                type="button"
                                className="product-detail__add"
                                onClick={() => addItem(product)}
                                aria-label={`Add ${product.name} to cart`}
                            >
                                Add to cart
                            </button>
                            <Link to="/cart">View cart</Link>
                        </div>
                    )}

                    <ProductInformation item={product} />
                </article>
            )}
        </main>
    );
}
