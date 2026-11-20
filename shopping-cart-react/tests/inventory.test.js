import test from "node:test";
import assert from "node:assert/strict";
import { demoInventory } from "../src/data/demoInventory.js";
import { storeCatalog } from "../src/data/storeCatalog.js";
import { canAddToCart, getAvailableStock, getInventoryStatus, getRemainingStock, validateCartAgainstInventory } from "../src/features/inventory/inventory.js";
import { cartReducer, initialCartState } from "../src/features/cart/cartReducer.js";
import { hydrateCartPayload, parseStoredCart, createPersistedCartPayload } from "../src/features/cart/cartStorage.js";
import { createDemoOrder } from "../src/features/checkout/orderFactory.js";
import { getCartItemCount, getCartTotal } from "../src/features/cart/cartSelectors.js";

const mango = storeCatalog[0];
const pineapple = storeCatalog[1];
const papaya = storeCatalog[2];
const add = (state, product, quantity = 1) => cartReducer(state, { type: "ADD_ITEM", payload: { product, quantity } });
const action = (state, type, productId, quantity) => cartReducer(state, { type, payload: { productId, quantity } });

test("inventory validates identities, stock, thresholds and limits", () => {
    assert.equal(getInventoryStatus(mango.id), "in_stock");
    assert.equal(getInventoryStatus(pineapple.id), "low_stock");
    assert.equal(getInventoryStatus(papaya.id), "out_of_stock");
    assert.equal(getAvailableStock("unknown"), null);
    assert.equal(getAvailableStock("REF-001"), null);
    for (const availableQuantity of [-1, 1.5]) {
        assert.equal(getAvailableStock(mango.id, { ...demoInventory, [mango.id]: { ...demoInventory[mango.id], availableQuantity } }), null);
    }
    assert.equal(canAddToCart(mango.id, 11, 2), false);
    assert.equal(canAddToCart(mango.id, 0, 100, { ...demoInventory, [mango.id]: { ...demoInventory[mango.id], availableQuantity: 120 } }), false);
    assert.equal(canAddToCart(mango.id, 0, 1.5), false);
    assert.equal(getRemainingStock(mango.id, 2), 10);
    assert.equal(validateCartAgainstInventory([{ productId: papaya.id, quantity: 1 }]).isValid, false);
});

test("cart actions enforce stock and preserve totals", () => {
    let state = add(initialCartState, mango, 2);
    assert.equal(state.items[0].quantity, 2);
    assert.equal(add(state, papaya), state);
    assert.equal(add(state, mango, 11), state);
    assert.equal(add(state, { id: "unknown", isDemo: true }), state);
    assert.equal(action(state, "UPDATE_QUANTITY", mango.id, 100), state);
    state = action(state, "UPDATE_QUANTITY", mango.id, 12);
    assert.equal(action(state, "INCREMENT_QUANTITY", mango.id), state);
    state = action(state, "DECREMENT_QUANTITY", mango.id);
    assert.equal(getCartItemCount(state.items), 11);
    assert.equal(getCartTotal(state.items), 11 * mango.price);
    state = action(state, "REMOVE_ITEM", mango.id);
    assert.equal(state.items.length, 0);
    state = add(state, mango);
    assert.equal(cartReducer(state, { type: "CLEAR_CART" }).items.length, 0);
});

test("v1 hydration reconstructs, clamps and removes out-of-stock items", () => {
    const payload = { version: 1, items: [{ productId: mango.id, quantity: 2 }] };
    assert.equal(hydrateCartPayload(payload).state.items[0].quantity, 2);
    const adjusted = hydrateCartPayload({ version: 1, items: [{ productId: mango.id, quantity: 30 }, { productId: papaya.id, quantity: 1 }] });
    assert.equal(adjusted.adjusted, true);
    assert.equal(adjusted.state.items[0].quantity, 12);
    assert.equal(adjusted.state.items.length, 1);
    assert.equal(parseStoredCart("{").status, "invalid-json");
    assert.deepEqual(createPersistedCartPayload(adjusted.state.items), { version: 1, items: [{ productId: mango.id, quantity: 12 }] });
});

test("checkout revalidates stock and uses authoritative prices", () => {
    const form = { customerName: "Demo", deliveryMethod: "pickup", notes: "" };
    const result = createDemoOrder([{ productId: mango.id, quantity: 2, unitPrice: 1 }], form);
    assert.equal(result.ok, true);
    assert.equal(result.order.total, 2 * mango.price);
    assert.equal(result.order.isDemo, true);
    assert.equal(Object.isFrozen(result.order), true);
    assert.equal(createDemoOrder([{ productId: mango.id, quantity: 13 }], form).ok, false);
    assert.equal(createDemoOrder([{ productId: papaya.id, quantity: 1 }], form).ok, false);
    assert.equal(getAvailableStock(mango.id), 12);
});
