import { sanitizeOrder } from "./orderDomain.js";

export const ORDER_STORAGE_KEY = "shopping-cart-project:orders:v1";
export const ORDER_STORAGE_VERSION = 1;

function browserStorage() {
    try { return typeof window === "undefined" ? null : window.localStorage; }
    catch { return null; }
}

export function parseStoredOrders(raw) {
    if (raw === null) return { ok: true, status: "empty", orders: [] };
    try {
        const payload = JSON.parse(raw);
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { ok: false, status: "invalid-payload", orders: [] };
        if (payload.version !== ORDER_STORAGE_VERSION) return { ok: false, status: "unsupported-version", orders: [] };
        if (!Array.isArray(payload.orders)) return { ok: false, status: "invalid-payload", orders: [] };
        const orders = payload.orders.map(sanitizeOrder);
        if (orders.some((order) => !order) || new Set(orders.map((order) => order.id)).size !== orders.length) {
            return { ok: false, status: "invalid-payload", orders: [] };
        }
        return { ok: true, status: "loaded", orders };
    } catch {
        return { ok: false, status: "invalid-json", orders: [] };
    }
}

export function loadOrders(storage = browserStorage()) {
    if (!storage) return { ok: false, status: "storage-unavailable", orders: [] };
    try { return parseStoredOrders(storage.getItem(ORDER_STORAGE_KEY)); }
    catch { return { ok: false, status: "storage-read-error", orders: [] }; }
}

export function saveOrders(orders, storage = browserStorage()) {
    if (!storage) return { ok: false, status: "storage-unavailable" };
    const existing = loadOrders(storage);
    if (!existing.ok) return { ok: false, status: existing.status };
    if (!Array.isArray(orders)) return { ok: false, status: "invalid-payload" };
    const sanitized = orders.map(sanitizeOrder);
    if (sanitized.some((order) => !order) || new Set(sanitized.map((order) => order.id)).size !== sanitized.length) {
        return { ok: false, status: "invalid-payload" };
    }
    try {
        storage.setItem(ORDER_STORAGE_KEY, JSON.stringify({ version: ORDER_STORAGE_VERSION, orders: sanitized }));
        return { ok: true, status: "saved" };
    } catch { return { ok: false, status: "storage-write-error" }; }
}
