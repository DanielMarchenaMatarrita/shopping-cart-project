import { useState } from "react";
import { Link } from "react-router";
import { useOrders } from "../features/orders/useOrders";
import { ORDER_STATUSES } from "../features/orders/orderDomain";
import { selectOrders } from "../features/orders/orderReducer";
import { formatCrc } from "../utils/formatCurrency";

export default function OrdersPage() {
    const { orders, storageStatus } = useOrders();
    const [filter, setFilter] = useState("all");
    const visible = selectOrders(orders, filter);
    return (
        <main className="catalog-page orders-page">
            <p className="eyebrow">Browser-local simulation</p>
            <h1>Simulated order history</h1>
            <p>Fictional orders only. This history is stored in this browser and can be modified or deleted; it is not synchronized.</p>
            {storageStatus && <p className="checkout-alert" role="alert">Order history could not be read ({storageStatus}). Existing storage has not been overwritten.</p>}
            <div className="filter-field">
                <label htmlFor="order-status-filter">Filter by status</label>
                <select id="order-status-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
                    <option value="all">All statuses</option>
                    {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>
            {visible.length === 0 ? <p>{orders.length ? "No simulated orders match this status." : "No simulated orders yet."}</p> : (
                <ul className="orders-list">
                    {visible.map((order) => (
                        <li key={order.id} className="orders-list__item">
                            <h2><Link to={`/orders/${encodeURIComponent(order.id)}`}>{order.id}</Link></h2>
                            <p><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time> · {order.status}</p>
                            <p>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {formatCrc(order.total)}</p>
                        </li>
                    ))}
                </ul>
            )}
            <p><Link to="/products">Return to products</Link></p>
        </main>
    );
}
