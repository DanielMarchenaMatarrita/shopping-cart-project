import { formatCrc } from "../utils/formatCurrency";
import {
    getCartLineSubtotal,
} from "../features/cart/cartSelectors";
import { canAddToCart } from "../features/inventory/inventory";

export default function CartItem({
    item,
    onIncrement,
    onDecrement,
    onRemove,
}) {
    const lineSubtotal = getCartLineSubtotal(item);
    const canIncrement = canAddToCart(item.productId, item.quantity, 1);

    return (
        <li className="cart-item">
            <div className="cart-item__info">
                <h3>{item.name}</h3>
                <p className="cart-item__meta">
                    {formatCrc(item.unitPrice)} / {item.unit}
                    {item.isDemo && (
                        <span className="cart-item__demo">Demo item</span>
                    )}
                </p>
                {!canIncrement && <p>Fictional demo stock or cart quantity limit reached.</p>}
            </div>

            <div
                className="cart-item__quantity"
                role="group"
                aria-label={`Quantity for ${item.name}`}
            >
                <button
                    type="button"
                    onClick={() => onDecrement(item.productId)}
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                >
                    −
                </button>
                <output aria-label={`Quantity: ${item.quantity}`}>
                    {item.quantity}
                </output>
                <button
                    type="button"
                    onClick={() => onIncrement(item.productId)}
                    disabled={!canIncrement}
                    aria-label={`Increase quantity of ${item.name}`}
                >
                    +
                </button>
            </div>

            <p className="cart-item__line-total">
                {formatCrc(lineSubtotal)}
            </p>

            <button
                type="button"
                className="cart-item__remove"
                onClick={() => onRemove(item.productId)}
                aria-label={`Remove ${item.name} from cart`}
            >
                Remove
            </button>
        </li>
    );
}
