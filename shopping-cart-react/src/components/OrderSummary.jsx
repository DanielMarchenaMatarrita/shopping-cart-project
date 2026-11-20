import { formatCrc } from "../utils/formatCurrency";

export default function OrderSummary({ order }) {
    return (
        <section className="order-summary" aria-labelledby="order-summary-title">
            <h2 id="order-summary-title">Order summary</h2>
            <ul className="order-summary__items">
                {order.items.map((item) => (
                    <li key={item.productId}>
                        <div>
                            <strong>{item.name}</strong>
                            <span>
                                {formatCrc(item.unitPrice)} / {item.unit} ×{" "}
                                {item.quantity}
                            </span>
                        </div>
                        <strong>{formatCrc(item.lineSubtotal)}</strong>
                    </li>
                ))}
            </ul>
            <dl className="order-summary__totals">
                <div>
                    <dt>Subtotal</dt>
                    <dd>{formatCrc(order.subtotal)}</dd>
                </div>
                <div className="order-summary__total">
                    <dt>Total</dt>
                    <dd>{formatCrc(order.total)}</dd>
                </div>
            </dl>
        </section>
    );
}
