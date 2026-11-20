import { createHistoricalOrder } from "./orderDomain.js";
import { orderReducer } from "./orderReducer.js";
import { loadOrders, saveOrders } from "./orderStorage.js";

export function recordHistoricalOrder(snapshot, id, createdAt, storage) {
    const order = createHistoricalOrder(snapshot, id, createdAt);
    if (!order) return { ok: false, status: "invalid-order" };
    const current = loadOrders(storage);
    if (!current.ok) return current;
    const existing = current.orders.find((entry) => entry.id === id);
    if (existing) {
        const same = JSON.stringify({ ...existing, status: "pending" }) === JSON.stringify(order);
        return same ? { ok: true, order: existing, orders: current.orders } : { ok: false, status: "duplicate-id" };
    }
    const next = orderReducer({ orders: current.orders }, { type: "ADD", order });
    const saved = saveOrders(next.orders, storage);
    return saved.ok ? { ok: true, order, orders: next.orders } : saved;
}

export function advanceHistoricalOrder(id, status, storage) {
    const current = loadOrders(storage);
    if (!current.ok) return current;
    const previous = { orders: current.orders };
    const next = orderReducer(previous, { type: "TRANSITION", id, status });
    if (next === previous) return { ok: false, status: "invalid-transition" };
    const saved = saveOrders(next.orders, storage);
    return saved.ok ? { ok: true, orders: next.orders } : saved;
}
