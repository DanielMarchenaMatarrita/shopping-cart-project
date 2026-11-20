import test from "node:test";
import assert from "node:assert/strict";
import { createDemoOrder } from "../src/features/checkout/orderFactory.js";
import { storeCatalog } from "../src/data/storeCatalog.js";
import { createHistoricalOrder, canTransition, nextOrderStatus } from "../src/features/orders/orderDomain.js";
import { orderReducer, selectOrders } from "../src/features/orders/orderReducer.js";
import { loadOrders, parseStoredOrders, ORDER_STORAGE_KEY, saveOrders } from "../src/features/orders/orderStorage.js";
import { recordHistoricalOrder, advanceHistoricalOrder } from "../src/features/orders/orderOperations.js";

const form = { customerName: "PRIVATE NAME", deliveryMethod: "pickup", notes: "PRIVATE NOTE" };
const id = "local-demo-test-1";
const date = "2026-11-19T12:00:00.000Z";
const checkout = (items = [{ productId: "DEMO-001", quantity: 2, unitPrice: 1 }], catalog) => createDemoOrder(items, form, catalog);
function memoryStorage(initial = null) {
    let raw = initial;
    return { getItem: () => raw, setItem: (key, value) => { assert.equal(key, ORDER_STORAGE_KEY); raw = value; }, raw: () => raw };
}

test("validated checkout creates one sanitized historical order at authoritative prices", () => {
    assert.equal(checkout([]).ok, false);
    assert.equal(checkout([{ productId: "reference", quantity: 1 }]).ok, false);
    assert.equal(checkout([{ productId: "DEMO-003", quantity: 1 }]).ok, false);
    assert.equal(checkout([{ productId: "DEMO-001", quantity: 13 }]).ok, false);
    const result = checkout();
    assert.equal(result.order.total, 2400);
    const storage = memoryStorage();
    const recorded = recordHistoricalOrder(result.order, id, date, storage);
    assert.equal(recorded.ok, true);
    assert.equal(recordHistoricalOrder(result.order, id, date, storage).ok, true);
    assert.equal(loadOrders(storage).orders.length, 1);
    assert.equal(storage.raw().includes("PRIVATE"), false);
    assert.equal(storage.raw().includes("customerName"), false);
    assert.equal(storage.raw().includes("notes"), false);
    assert.equal(Object.isFrozen(recorded.order.items[0]), true);
    const changedCatalog = storeCatalog.map((p) => p.id === "DEMO-001" ? { ...p, price: 9999 } : p);
    assert.equal(checkout(undefined, changedCatalog).order.total, 19998);
    assert.equal(loadOrders(storage).orders[0].total, 2400);
    assert.equal(recordHistoricalOrder(null, id, date, storage).ok, false);
});

test("lifecycle allows only sequential transitions and preserves snapshots", () => {
    let state = { orders: [] };
    const order = createHistoricalOrder(checkout().order, id, date);
    state = orderReducer(state, { type: "ADD", order });
    assert.equal(orderReducer(state, { type: "ADD", order }), state);
    assert.equal(canTransition("pending", "ready"), false);
    assert.equal(canTransition("unknown", "pending"), false);
    assert.equal(orderReducer(state, { type: "TRANSITION", id: "missing", status: "preparing" }), state);
    for (const status of ["preparing", "ready", "completed"]) {
        const before = state.orders[0];
        state = orderReducer(state, { type: "TRANSITION", id, status });
        assert.equal(state.orders[0].status, status);
        assert.equal(state.orders[0].items, before.items);
    }
    assert.equal(nextOrderStatus("completed"), null);
    assert.equal(orderReducer(state, { type: "TRANSITION", id, status: "ready" }), state);
    assert.equal(selectOrders(state.orders, "completed").length, 1);
    assert.equal(selectOrders(state.orders, "pending").length, 0);
});

test("storage rejects corruption, incompatible versions and access failures without overwriting", () => {
    assert.equal(parseStoredOrders("{").status, "invalid-json");
    assert.equal(parseStoredOrders(JSON.stringify({ version: 1, orders: [{}] })).status, "invalid-payload");
    const future = JSON.stringify({ version: 2, orders: [] });
    const storage = memoryStorage(future);
    assert.equal(recordHistoricalOrder(checkout().order, id, date, storage).ok, false);
    assert.equal(storage.raw(), future);
    assert.equal(saveOrders([], storage).ok, false);
    const broken = { getItem() { throw Error("denied"); }, setItem() { throw Error("denied"); } };
    assert.equal(loadOrders(broken).ok, false);
    assert.equal(recordHistoricalOrder(checkout().order, id, date, broken).ok, false);
    const quota = { getItem: () => null, setItem() { throw Error("quota"); } };
    assert.equal(recordHistoricalOrder(checkout().order, id, date, quota).ok, false);
});

test("transitions persist and unknown, skipped or reversed updates fail", () => {
    const storage = memoryStorage();
    recordHistoricalOrder(checkout().order, id, date, storage);
    assert.equal(advanceHistoricalOrder(id, "ready", storage).ok, false);
    assert.equal(advanceHistoricalOrder("unknown", "preparing", storage).ok, false);
    for (const status of ["preparing", "ready", "completed"]) assert.equal(advanceHistoricalOrder(id, status, storage).ok, true);
    assert.equal(loadOrders(storage).orders[0].status, "completed");
    assert.equal(advanceHistoricalOrder(id, "preparing", storage).ok, false);
});
