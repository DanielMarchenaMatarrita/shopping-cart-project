import { useState } from "react";
import { Link, useParams } from "react-router";
import OrderSummary from "../components/OrderSummary";
import { DELIVERY_METHODS } from "../features/checkout/checkoutValidation";
import { nextOrderStatus } from "../features/orders/orderDomain";
import { useOrders } from "../features/orders/useOrders";

export default function OrderDetailPage() {
    const { id } = useParams();
    const { orders, advanceOrder, storageStatus } = useOrders();
    const [message, setMessage] = useState("");
    const order = orders.find((entry) => entry.id === id);
    if (!order) return <main className="catalog-page"><h1>Simulated order not found</h1><p>{storageStatus ? "Browser history could not be read." : "No matching local demo order exists."}</p><Link to="/orders">Return to order history</Link></main>;
    const next = nextOrderStatus(order.status);
    function advance() {
        const result = advanceOrder(order.id, next);
        setMessage(result.ok ? `Simulated status updated to ${next}.` : "Status could not be updated. Check the transition and browser storage.");
    }
    return (
        <main className="catalog-page orders-page">
            <p><Link to="/orders">← Order history</Link></p>
            <p className="eyebrow">Fictional local order</p>
            <h1>Simulated order details</h1>
            <dl className="order-details">
                <dt>Local demo ID</dt><dd>{order.id}</dd>
                <dt>Created</dt><dd><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time></dd>
                <dt>Status</dt><dd>{order.status}</dd>
                <dt>Fulfillment</dt><dd>{DELIVERY_METHODS[order.deliveryMethod]}</dd>
            </dl>
            <OrderSummary order={order} />
            <section aria-labelledby="simulation-tools">
                <h2 id="simulation-tools">Status simulation</h2>
                <p>No real order or inventory is changed.</p>
                {next ? <button className="checkout-button" type="button" onClick={advance}>Advance to {next}</button> : <p>Completed is the final status.</p>}
                <p role="status">{message}</p>
            </section>
        </main>
    );
}
