import { Link, useLocation } from "react-router";
import OrderSummary from "../components/OrderSummary";
import { DELIVERY_METHODS } from "../features/checkout/checkoutValidation";
import { useOrders } from "../features/orders/useOrders";

export default function OrderConfirmationPage() {
    const location = useLocation();
    const { orders } = useOrders();
    const order = orders.find((entry) => entry.id === location.state?.orderId);

    if (!order) {
        return (
            <main className="catalog-page confirmation-page">
                <p className="eyebrow">Demo checkout</p>
                <h1>No simulated order to display</h1>
                <p>
                    This confirmation is available only immediately after a
                    successful demo checkout.
                </p>
                <Link to="/products#demo-store">Return to demo products</Link>
            </main>
        );
    }

    return (
        <main className="catalog-page confirmation-page">
            <p className="eyebrow">Simulation confirmed</p>
            <h1>Demo order confirmed</h1>
            <p className="confirmation-page__notice">
                This is a local simulation. No payment, real order, delivery,
                or inventory reservation was created.
            </p>

            <section className="confirmation-page__details" aria-labelledby="confirmation-details-title">
                <h2 id="confirmation-details-title">Simulation details</h2>
                <dl>
                    <div>
                        <dt>Local demo reference</dt>
                        <dd>{order.id}</dd>
                    </div>
                    <div>
                        <dt>Fulfillment</dt>
                        <dd>{DELIVERY_METHODS[order.deliveryMethod]}</dd>
                    </div>
                </dl>
            </section>

            <OrderSummary order={order} />
            <p className="confirmation-page__actions">
                <Link to="/products">Return to catalog</Link>
                {" · "}<Link to={`/orders/${encodeURIComponent(order.id)}`}>View saved demo order</Link>
            </p>
        </main>
    );
}
