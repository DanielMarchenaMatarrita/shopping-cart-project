import { useCart } from "../features/cart/useCart";

export default function CartBadge() {
    const { itemCount } = useCart();
    const label = `${itemCount} item${itemCount === 1 ? "" : "s"} in cart`;

    return (
        <span className="cart-badge" aria-label={label} aria-live="polite">
            {itemCount}
        </span>
    );
}
