const NEXT = Object.freeze({ pending: "preparing", preparing: "ready", ready: "completed" });
export const ORDER_STATUSES = Object.freeze(["pending", "preparing", "ready", "completed"]);

export function nextOrderStatus(status) {
    return Object.hasOwn(NEXT, status) ? NEXT[status] : null;
}

export function canTransition(from, to) {
    return nextOrderStatus(from) !== null && nextOrderStatus(from) === to;
}

// Reconstruct an allowlisted record: never persist customer-entered fields.
export function sanitizeOrder(value) {
    if (!value || typeof value !== "object" ||
        typeof value.id !== "string" || !/^local-demo-[a-zA-Z0-9-]{1,80}$/.test(value.id) ||
        typeof value.createdAt !== "string" ||
        !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value.createdAt) ||
        !Number.isFinite(Date.parse(value.createdAt)) ||
        new Date(value.createdAt).toISOString() !== value.createdAt ||
        !ORDER_STATUSES.includes(value.status) || value.isDemo !== true ||
        value.currency !== "CRC" || !["pickup", "delivery"].includes(value.deliveryMethod) ||
        !Array.isArray(value.items) || value.items.length === 0 || value.items.length > 100) return null;

    const seen = new Set();
    const items = [];
    let subtotal = 0;
    for (const item of value.items) {
        if (!item || typeof item.productId !== "string" || !/^DEMO-[A-Za-z0-9-]{1,30}$/.test(item.productId) ||
            seen.has(item.productId) || typeof item.name !== "string" || !item.name.trim() || item.name.length > 150 ||
            typeof item.unit !== "string" || !item.unit.trim() || item.unit.length > 40 ||
            !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 ||
            !Number.isSafeInteger(item.unitPrice) || item.unitPrice < 1 ||
            !Number.isSafeInteger(item.lineSubtotal) || item.lineSubtotal !== item.unitPrice * item.quantity) return null;
        seen.add(item.productId);
        subtotal += item.lineSubtotal;
        items.push(Object.freeze({ productId: item.productId, name: item.name, quantity: item.quantity, unit: item.unit, unitPrice: item.unitPrice, lineSubtotal: item.lineSubtotal }));
    }
    if (!Number.isSafeInteger(subtotal) || value.subtotal !== subtotal || value.total !== subtotal) return null;
    return Object.freeze({
        id: value.id, createdAt: value.createdAt, status: value.status, isDemo: true,
        currency: "CRC", deliveryMethod: value.deliveryMethod,
        items: Object.freeze(items), subtotal, total: subtotal,
    });
}

export function createHistoricalOrder(snapshot, id, createdAt) {
    if (snapshot?.demoReference !== "LOCAL-DEMO-ORDER") return null;
    return sanitizeOrder({ ...snapshot, id, createdAt, status: "pending" });
}
