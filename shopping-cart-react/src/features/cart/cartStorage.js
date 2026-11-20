import { storeCatalog } from "../../data/storeCatalog.js";
import {
    createCartLine,
    initialCartState,
    MAX_CART_QUANTITY,
    normalizeCartQuantity,
} from "./cartReducer.js";

export const CART_STORAGE_KEY = "shopping-cart-project:cart:v1";
export const CART_STORAGE_VERSION = 1;

function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function findEligibleDemoProduct(productId, catalog) {
    return catalog.find((product) => product.id === productId) ?? null;
}

function getEmptyHydration(status) {
    return {
        state: initialCartState,
        status,
    };
}

/**
 * Treats stored JSON as untrusted input and reconstructs lines from the
 * current demo catalog. Duplicate IDs are merged, capped at 99, in record
 * order. Extra stored fields are deliberately ignored.
 */
export function hydrateCartPayload(payload, catalog = storeCatalog) {
    if (!isRecord(payload)) return getEmptyHydration("invalid-payload");

    if (payload.version !== CART_STORAGE_VERSION) {
        return getEmptyHydration("unsupported-version");
    }

    if (!Array.isArray(payload.items)) {
        return getEmptyHydration("invalid-payload");
    }

    const quantitiesByProductId = new Map();

    for (const record of payload.items) {
        if (!isRecord(record)) continue;
        if (
            typeof record.productId !== "string" ||
            record.productId.trim() === ""
        ) {
            continue;
        }

        // Persisted values must already be numbers. In particular, `"2"` is
        // not accepted as a quantity at this trust boundary.
        if (
            !Number.isInteger(record.quantity) ||
            record.quantity < 1 ||
            record.quantity > MAX_CART_QUANTITY
        ) {
            continue;
        }

        const quantity = normalizeCartQuantity(record.quantity);
        if (quantity === null) continue;

        const product = findEligibleDemoProduct(record.productId, catalog);
        const line = createCartLine(product, quantity);
        if (!line) continue;

        const currentQuantity = quantitiesByProductId.get(line.productId) ?? 0;
        quantitiesByProductId.set(
            line.productId,
            Math.min(currentQuantity + quantity, MAX_CART_QUANTITY)
        );
    }

    const items = [];

    for (const [productId, quantity] of quantitiesByProductId) {
        const product = findEligibleDemoProduct(productId, catalog);
        const line = createCartLine(product, quantity);

        if (line) items.push(line);
    }

    return {
        state: { items },
        status: "hydrated",
    };
}

export function parseStoredCart(rawValue, catalog = storeCatalog) {
    if (typeof rawValue !== "string" || rawValue.trim() === "") {
        return getEmptyHydration("empty");
    }

    try {
        return hydrateCartPayload(JSON.parse(rawValue), catalog);
    } catch {
        return getEmptyHydration("invalid-json");
    }
}

export function createPersistedCartPayload(items = [], catalog = storeCatalog) {
    const persistedItems = Array.isArray(items)
        ? items.flatMap((item) => {
              const quantity = normalizeCartQuantity(item?.quantity);
              const productId = item?.productId;

              if (
                  typeof productId !== "string" ||
                  productId.trim() === "" ||
                  quantity === null
              ) {
                  return [];
              }

              // A cart line is expected to be trusted reducer output, but
              // serialization still resolves its ID against the catalog.
              const line = createCartLine(
                  findEligibleDemoProduct(productId, catalog),
                  quantity
              );

              return line ? [{ productId: line.productId, quantity }] : [];
          })
        : [];

    return {
        version: CART_STORAGE_VERSION,
        items: persistedItems,
    };
}

export function serializeCartItems(items) {
    return JSON.stringify(createPersistedCartPayload(items));
}

function getBrowserStorage() {
    if (typeof window === "undefined") return null;

    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export function loadCartFromStorage(storage = getBrowserStorage()) {
    if (!storage) return getEmptyHydration("storage-unavailable");

    try {
        return parseStoredCart(storage.getItem(CART_STORAGE_KEY));
    } catch {
        return getEmptyHydration("storage-read-error");
    }
}

export function saveCartToStorage(items, storage = getBrowserStorage()) {
    if (!storage) {
        return { ok: false, status: "storage-unavailable" };
    }

    try {
        storage.setItem(CART_STORAGE_KEY, serializeCartItems(items));
        return { ok: true, status: "saved" };
    } catch {
        return { ok: false, status: "storage-write-error" };
    }
}
