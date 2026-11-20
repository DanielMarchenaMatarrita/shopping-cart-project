import { demoInventory } from "../../data/demoInventory.js";
import { storeCatalog } from "../../data/storeCatalog.js";
import { getAvailableStock, getInventoryStatus } from "../inventory/inventory.js";
import { ORDER_STATUSES, sanitizeOrder } from "../orders/orderDomain.js";
import { selectOrders } from "../orders/orderReducer.js";

export function getInventorySummary(products = storeCatalog, inventory = demoInventory) {
    const counts = { in_stock: 0, low_stock: 0, out_of_stock: 0, unavailable: 0 };
    const alerts = [];
    const seen = new Set();
    const units = new Set();
    let totalUnits = 0;
    for (const product of Array.isArray(products) ? products : []) {
        if (!product || product.isDemo !== true || product.available !== true ||
            typeof product.id !== "string" || seen.has(product.id)) continue;
        seen.add(product.id);
        const stock = getAvailableStock(product.id, inventory ?? {});
        const status = getInventoryStatus(product.id, inventory ?? {});
        counts[status] += 1;
        if (stock !== null) {
            units.add(product.unit);
            totalUnits += stock;
        }
        if (status !== "in_stock") alerts.push({ productId: product.id, name: product.name, status, stock, unit: product.unit });
    }
    const completeTotal = counts.unavailable === 0 && units.size === 1 && Number.isSafeInteger(totalUnits);
    return { totalSkus: seen.size, counts, totalUnits: completeTotal ? totalUnits : null, unit: completeTotal ? [...units][0] : null, alerts };
}

export function getOrderSummary(orders) {
    const valid = [];
    const seen = new Set();
    let invalidCount = 0;
    for (const input of Array.isArray(orders) ? orders : []) {
        const order = sanitizeOrder(input);
        if (!order || seen.has(order.id)) {
            invalidCount += 1;
            continue;
        }
        seen.add(order.id);
        valid.push(order);
    }
    const counts = Object.fromEntries(ORDER_STATUSES.map((status) => [status, 0]));
    let total = 0;
    let units = 0;
    for (const order of valid) {
        counts[order.status] += 1;
        total += order.total;
        units += order.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    const safeTotal = Number.isSafeInteger(total) ? total : null;
    return {
        totalOrders: valid.length, counts, invalidCount, orders: valid,
        total: safeTotal,
        average: safeTotal === null ? null : valid.length ? Math.round(safeTotal / valid.length) : 0,
        units: Number.isSafeInteger(units) ? units : null,
    };
}

export function getRecentOrders(orders, limit = 5) {
    if (!Number.isSafeInteger(limit) || limit < 0) return [];
    return selectOrders(getOrderSummary(orders).orders).slice(0, limit);
}
