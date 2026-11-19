import { Link } from "react-router";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { useCart } from "../features/cart/useCart";

export default function CartPage() {
    const {
        items,
        itemCount,
        subtotal,
        total,
        incrementQuantity,
        decrementQuantity,
        removeItem,
        clearCart,
    } = useCart();

    const isEmpty = items.length === 0;

    return (
        <main className="catalog-page cart-page">
            <header className="cart-page__header">
                <p className="eyebrow">Demo store</p>
                <h1>Shopping cart</h1>
                <p className="cart-page__notice">
                    All prices are fictional demo values in Costa Rican colones
                    (CRC). This cart is not a real order or inventory
                    reservation.
                </p>
            </header>

            {isEmpty ? (
                <section className="cart-empty" aria-labelledby="empty-cart-title">
                    <h2 id="empty-cart-title">Your cart is empty</h2>
                    <p>
                        Add a fictional demo product from the catalog to test
                        the cart.
                    </p>
                    <p>
                        <Link to="/products#demo-store">
                            Browse demo products
                        </Link>
                    </p>
                </section>
            ) : (
                <>
                    <div className="cart-layout">
                        <section aria-labelledby="cart-items-title">
                            <div className="cart-items__header">
                                <h2 id="cart-items-title">Items</h2>
                                <button
                                    type="button"
                                    className="cart-items__clear"
                                    onClick={clearCart}
                                >
                                    Clear cart
                                </button>
                            </div>

                            <ul className="cart-list">
                                {items.map((item) => (
                                    <CartItem
                                        key={item.productId}
                                        item={item}
                                        onIncrement={incrementQuantity}
                                        onDecrement={decrementQuantity}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </ul>
                        </section>

                        <CartSummary
                            itemCount={itemCount}
                            subtotal={subtotal}
                            total={total}
                        />
                    </div>

                    <p className="cart-page__actions">
                        <Link to="/products">← Continue shopping</Link>
                    </p>
                </>
            )}
        </main>
    );
}
