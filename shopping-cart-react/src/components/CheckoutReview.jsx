import { DELIVERY_METHODS } from "../features/checkout/checkoutValidation";
import OrderSummary from "./OrderSummary";

export default function CheckoutReview({
    order,
    onEdit,
    onConfirm,
    isConfirming,
}) {
    return (
        <section className="checkout-review" aria-labelledby="checkout-review-title">
            <p className="eyebrow">Step 2 of 2</p>
            <h2 id="checkout-review-title">Review your simulated order</h2>
            <p className="checkout-review__notice">
                No payment, order, delivery, or inventory reservation will be
                created.
            </p>
            <dl className="checkout-review__details">
                <div>
                    <dt>Display name</dt>
                    <dd>{order.customerName}</dd>
                </div>
                <div>
                    <dt>Fulfillment</dt>
                    <dd>{DELIVERY_METHODS[order.deliveryMethod]}</dd>
                </div>
                {order.notes && (
                    <div>
                        <dt>Demo notes</dt>
                        <dd>{order.notes}</dd>
                    </div>
                )}
            </dl>
            <OrderSummary order={order} />
            <div className="checkout-review__actions">
                <button type="button" className="checkout-button--secondary" onClick={onEdit}>
                    Edit information
                </button>
                <button
                    type="button"
                    className="checkout-button"
                    onClick={onConfirm}
                    disabled={isConfirming}
                >
                    {isConfirming
                        ? "Confirming simulation…"
                        : "Confirm demo order"}
                </button>
            </div>
        </section>
    );
}
