import { canAddToCart, MAX_CART_QUANTITY } from "../inventory/inventory.js";
import { storeCatalog } from "../../data/storeCatalog.js";

export { MAX_CART_QUANTITY };

export const initialCartState = {
    items: [],
};

export function normalizeCartQuantity(value) {
    const quantity = Number(value);

    // Whole-number quantities only; reject decimals rather than truncating
    // them silently.
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) return null;
    return quantity;
}

export function createCartLine(product, quantity) {
    if (!product || typeof product !== "object") return null;
    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_CART_QUANTITY
    ) {
        return null;
    }

    const hasValidIdentity =
        typeof product.id === "string" && product.id.trim() !== "";
    const hasValidName =
        typeof product.name === "string" && product.name.trim() !== "";
    const hasValidPrice =
        Number.isInteger(product.price) && product.price > 0;
    const isAvailable = product.available === true;
    const isDemoProduct = product.isDemo === true;

    if (
        !hasValidIdentity ||
        !hasValidName ||
        !hasValidPrice ||
        !isAvailable ||
        !isDemoProduct
    ) {
        return null;
    }

    return {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        currency: product.currency ?? "CRC",
        unit: product.unit ?? "unit",
        isDemo: product.isDemo === true,
        quantity,
    };
}

function matchesProduct(item, productId) {
    return item.productId === productId;
}

export function cartReducer(state, action) {
    switch (action?.type) {
        case "ADD_ITEM": {
            const quantity = normalizeCartQuantity(
                action.payload?.quantity ?? 1
            );
            const product = storeCatalog.find((entry) => entry.id === action.payload?.product?.id);
            const line = createCartLine(product, quantity);

            if (!line || quantity === null) return state;
            const existing = state.items.find((item) => matchesProduct(item, line.productId));
            if (!canAddToCart(line.productId, existing?.quantity ?? 0, quantity)) return state;

            const alreadyInCart = state.items.some((item) =>
                matchesProduct(item, line.productId)
            );

            if (!alreadyInCart) {
                return {
                    ...state,
                    items: [...state.items, line],
                };
            }

            return {
                ...state,
                items: state.items.map((item) => {
                    if (!matchesProduct(item, line.productId)) return item;

                    const nextQuantity = Math.min(
                        item.quantity + quantity,
                        MAX_CART_QUANTITY
                    );

                    if (nextQuantity === item.quantity) return item;

                    return {
                        ...item,
                        quantity: nextQuantity,
                    };
                }),
            };
        }

        case "INCREMENT_QUANTITY": {
            const productId = action.payload?.productId;
            const item = state.items.find((entry) =>
                matchesProduct(entry, productId)
            );

            if (!item || !canAddToCart(productId, item.quantity, 1)) return state;

            return {
                ...state,
                items: state.items.map((entry) =>
                    matchesProduct(entry, productId)
                        ? { ...entry, quantity: entry.quantity + 1 }
                        : entry
                ),
            };
        }

        case "DECREMENT_QUANTITY": {
            const productId = action.payload?.productId;
            const item = state.items.find((entry) =>
                matchesProduct(entry, productId)
            );

            // Explicit removal is a separate action; quantity never drops below 1.
            if (!item || item.quantity <= 1) return state;

            return {
                ...state,
                items: state.items.map((entry) =>
                    matchesProduct(entry, productId)
                        ? { ...entry, quantity: entry.quantity - 1 }
                        : entry
                ),
            };
        }

        case "UPDATE_QUANTITY": {
            const productId = action.payload?.productId;
            const quantity = normalizeCartQuantity(action.payload?.quantity);
            const item = state.items.find((entry) =>
                matchesProduct(entry, productId)
            );

            if (!item || quantity === null) return state;
            if (quantity === item.quantity) return state;
            if (quantity > item.quantity && !canAddToCart(productId, item.quantity, quantity - item.quantity)) return state;

            return {
                ...state,
                items: state.items.map((entry) =>
                    matchesProduct(entry, productId)
                        ? { ...entry, quantity }
                        : entry
                ),
            };
        }

        case "REMOVE_ITEM": {
            const productId = action.payload?.productId;

            if (
                !state.items.some((item) =>
                    matchesProduct(item, productId)
                )
            ) {
                return state;
            }

            return {
                ...state,
                items: state.items.filter(
                    (item) => !matchesProduct(item, productId)
                ),
            };
        }

        case "CLEAR_CART":
            return state.items.length === 0 ? state : { ...state, items: [] };

        default:
            return state;
    }
}
