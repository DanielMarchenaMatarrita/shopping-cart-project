import test from "node:test";
import assert from "node:assert/strict";
import { storeCatalog } from "../src/data/storeCatalog.js";
import { demoInventory } from "../src/data/demoInventory.js";
import { createDemoOrder } from "../src/features/checkout/orderFactory.js";
import { recordHistoricalOrder, advanceHistoricalOrder } from "../src/features/orders/orderOperations.js";
import { loadOrders } from "../src/features/orders/orderStorage.js";
import { getInventorySummary, getOrderSummary, getRecentOrders } from "../src/features/dashboard/dashboardSelectors.js";

const form = { customerName: "Demo", deliveryMethod: "pickup", notes: "" };
function snapshot(quantity = 1) {
    return createDemoOrder([{ productId: "DEMO-001", quantity }], form).order;
}
function storage() {
    let value = null;
    return { getItem: () => value, setItem: (_, next) => { value = next; } };
}
function makeOrder(id, time, quantity = 1) {
    const data = storage();
    return recordHistoricalOrder(snapshot(quantity), `local-demo-${id}`, time, data).order;
}

test("inventory categories are exclusive and ignore reference products", () => {
    const before = JSON.stringify(demoInventory);
    const products = [...storeCatalog, { id: "REF-1", isDemo: false, available: true }, storeCatalog[0]];
    const result = getInventorySummary(products, demoInventory);
    assert.equal(result.totalSkus, 5);
    assert.deepEqual(result.counts, { in_stock: 3, low_stock: 1, out_of_stock: 1, unavailable: 0 });
    assert.equal(result.totalUnits, 43);
    assert.deepEqual(result.alerts.map((item) => item.status), ["low_stock", "out_of_stock"]);
    assert.equal(JSON.stringify(demoInventory), before);
});

test("threshold boundary, missing inventory, invalid stock and incompatible units are conservative", () => {
    const inventory = { ...demoInventory, "DEMO-001": { ...demoInventory["DEMO-001"], availableQuantity: 3 } };
    assert.equal(getInventorySummary(storeCatalog, inventory).counts.low_stock, 2);
    const missing = { ...inventory };
    delete missing["DEMO-001"];
    const result = getInventorySummary(storeCatalog, missing);
    assert.equal(result.counts.unavailable, 1);
    assert.equal(result.totalUnits, null);
    assert.equal(result.alerts[0].status, "unavailable");
    const bad = { ...inventory, "DEMO-001": { ...inventory["DEMO-001"], availableQuantity: -1 } };
    assert.equal(getInventorySummary(storeCatalog, bad).counts.unavailable, 1);
    assert.equal(getInventorySummary(storeCatalog.map((p, i) => i === 0 ? { ...p, unit: "kg" } : p), inventory).totalUnits, null);
});

test("order aggregation is sanitized, rounded, sorted and non-mutating", () => {
    const empty = getOrderSummary([]);
    assert.equal(empty.totalOrders, 0);
    assert.equal(empty.total, 0);
    assert.equal(empty.average, 0);
    const a = makeOrder("a", "2026-01-01T00:00:00.000Z");
    const b = makeOrder("b", "2026-01-02T00:00:00.000Z");
    const c = makeOrder("c", "2026-01-02T00:00:00.000Z", 2);
    const one = { ...a, items: [{ ...a.items[0], unitPrice: 1201, lineSubtotal: 1201 }], subtotal: 1201, total: 1201 };
    const input = [one, { ...b, status: "ready" }, c, { ...c }, { bad: true }];
    const before = JSON.stringify(input);
    const result = getOrderSummary(input);
    assert.equal(result.totalOrders, 3);
    assert.equal(result.invalidCount, 2);
    assert.deepEqual(result.counts, { pending: 2, preparing: 0, ready: 1, completed: 0 });
    assert.equal(result.total, 4801);
    assert.equal(result.average, 1600);
    assert.equal(getOrderSummary([one, b]).average, 1201);
    assert.equal(result.units, 4);
    assert.deepEqual(getRecentOrders(input, 3).map((order) => order.id), [c.id, b.id, a.id]);
    assert.equal(JSON.stringify(input), before);
});

test("projections reflect order recording, transition and reload", () => {
    const data = storage();
    const result = recordHistoricalOrder(snapshot(), "local-demo-test", "2026-01-01T00:00:00.000Z", data);
    assert.equal(getOrderSummary(result.orders).counts.pending, 1);
    const updated = advanceHistoricalOrder(result.order.id, "preparing", data);
    assert.equal(getOrderSummary(updated.orders).counts.preparing, 1);
    assert.equal(getOrderSummary(loadOrders(data).orders).total, 1200);
    assert.equal(getRecentOrders(loadOrders(data).orders)[0].id, result.order.id);
});
