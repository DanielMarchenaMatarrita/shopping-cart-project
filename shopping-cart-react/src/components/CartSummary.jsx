import { formatCrc } from "../utils/formatCurrency";

export default function CartSummary({ itemCount, subtotal, total }) {
    return (
        <aside className="cart-summary" aria-labelledby="cart-summary-title">
            <h2 id="cart-summary-title">Summary</h2>

            <dl>
                <div className="cart-summary__row">
                    <dt>Items</dt>
                    <dd>{itemCount}</dd>
                </div>
                <div className="cart-summary__row">
                    <dt>Subtotal</dt>
                    <dd>{formatCrc(subtotal)}</dd>
                </div>
                <div className="cart-summary__row cart-summary__row--total">
                    <dt>Total</dt>
                    <dd>{formatCrc(total)}</dd>
                </div>
            </dl>

            <p className="cart-summary__note">
                No taxes, shipping, or discounts are applied in this demo.
                Prices are fictional CRC values.
            </p>
        </aside>
    );
}
