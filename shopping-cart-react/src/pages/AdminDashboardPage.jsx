import { Link } from "react-router";
import { getInventorySummary, getOrderSummary, getRecentOrders } from "../features/dashboard/dashboardSelectors";
import { useOrders } from "../features/orders/useOrders";
import { formatCrc } from "../utils/formatCurrency";
import "./AdminDashboardPage.css";

function MetricCard({ label, value, note }) {
    return <div className="admin-metric"><dt>{label}</dt><dd>{value}</dd>{note && <small>{note}</small>}</div>;
}

const statusLabels = { in_stock: "In stock", low_stock: "Low stock", out_of_stock: "Out of stock", unavailable: "Unavailable" };

export default function AdminDashboardPage() {
    const { orders, storageStatus } = useOrders();
    const inventory = getInventorySummary();
    const summary = getOrderSummary(orders);
    const recent = getRecentOrders(orders);
    return (
        <main className="catalog-page admin-page">
            <header>
                <p className="eyebrow">Public local demonstration · no administration access control</p>
                <h1>Demo Administration — Simulated Data Only</h1>
                <p>Fictional stock and browser-local orders. No real revenue, payment, inventory reservation, or business activity is represented.</p>
            </header>
            <section aria-labelledby="inventory-heading">
                <h2 id="inventory-heading">Inventory summary</h2>
                <dl className="admin-metrics">
                    <MetricCard label="Demo SKUs" value={inventory.totalSkus} />
                    {Object.entries(statusLabels).map(([status, label]) => <MetricCard key={status} label={label} value={inventory.counts[status]} />)}
                    <MetricCard label="Simulated stock units" value={inventory.totalUnits ?? "Unavailable"} note={inventory.totalUnits === null ? "Incomplete or incompatible inventory units" : `All quantities in ${inventory.unit}`} />
                </dl>
            </section>
            <section aria-labelledby="alerts-heading">
                <h2 id="alerts-heading">Inventory alerts</h2>
                {inventory.alerts.length ? <ul className="admin-list">{inventory.alerts.map((alert) => (
                    <li key={alert.productId}><Link to={`/products/${encodeURIComponent(alert.productId)}`}>{alert.name}</Link> — {statusLabels[alert.status]}{alert.stock !== null && ` (${alert.stock} ${alert.unit})`}</li>
                ))}</ul> : <p>No inventory alerts for demo products.</p>}
            </section>
            {storageStatus ? (
                <section className="admin-error" role="alert"><h2>Order metrics unavailable</h2><p>Browser-local order history could not be read. No order totals are shown; existing data was not changed.</p><Link to="/orders">View order history</Link></section>
            ) : (
                <>
                    <section aria-labelledby="orders-heading">
                        <h2 id="orders-heading">Simulated order summary</h2>
                        {summary.invalidCount > 0 && <p role="alert">{summary.invalidCount} invalid or duplicate order records excluded.</p>}
                        <dl className="admin-metrics">
                            <MetricCard label="Simulated orders" value={summary.totalOrders} />
                            <MetricCard label="Historical simulated total" value={summary.total === null ? "Unavailable" : formatCrc(summary.total)} note="Not revenue or payments" />
                            <MetricCard label="Average simulated order" value={summary.average === null ? "Unavailable" : formatCrc(summary.average)} note="Rounded to nearest CRC" />
                            <MetricCard label="Simulated ordered units" value={summary.units ?? "Unavailable"} />
                        </dl>
                    </section>
                    <section aria-labelledby="status-heading">
                        <h2 id="status-heading">Order status distribution</h2>
                        <dl className="admin-metrics">{Object.entries(summary.counts).map(([status, count]) => <MetricCard key={status} label={status} value={count} />)}</dl>
                        {summary.counts.pending > 0 && <p>{summary.counts.pending} simulated {summary.counts.pending === 1 ? "order is" : "orders are"} pending. <Link to="/orders">Review orders</Link></p>}
                    </section>
                    <section aria-labelledby="recent-heading">
                        <h2 id="recent-heading">Recent simulated orders</h2>
                        {recent.length ? <ul className="admin-list">{recent.map((order) => (
                            <li key={order.id}><Link to={`/orders/${encodeURIComponent(order.id)}`}>{order.id}</Link> · <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time> · {order.status} · {formatCrc(order.total)}</li>
                        ))}</ul> : <p>No simulated orders yet. Confirm a demo checkout to see it here.</p>}
                        <p><Link to="/orders">View all simulated orders</Link></p>
                    </section>
                </>
            )}
        </main>
    );
}
