import { storeCatalog } from "../../data/storeCatalog.js";
import { validateCartAgainstInventory } from "../inventory/inventory.js";
import {
    createCartLine,
    MAX_CART_QUANTITY,
} from "../cart/cartReducer.js";

export const DELIVERY_METHODS = {
    pickup: "Simulated pickup",
    delivery: "Simulated delivery",
};

const MAX_NAME_LENGTH = 60;
const MAX_NOTES_LENGTH = 240;

function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
}

export function validateCheckoutForm(input = {}) {
    const customerName = normalizeText(input.customerName);
    const deliveryMethod = normalizeText(input.deliveryMethod);
    const notes = normalizeText(input.notes);
    const errors = {};

    if (!customerName) {
        errors.customerName = "Enter a fictional display name.";
    } else if (customerName.length > MAX_NAME_LENGTH) {
        errors.customerName = `Display name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    }

    if (!Object.hasOwn(DELIVERY_METHODS, deliveryMethod)) {
        errors.deliveryMethod = "Choose a simulated fulfillment method.";
    }

    if (notes.length > MAX_NOTES_LENGTH) {
        errors.notes = `Notes must be ${MAX_NOTES_LENGTH} characters or fewer.`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        value: {
            customerName,
            deliveryMethod,
            notes,
        },
    };
}

function resolveEligibleDemoProduct(productId, catalog) {
    const product = catalog.find((entry) => entry.id === productId);

    return product?.isDemo === true ? product : null;
}

/**
 * Cart lines are treated as untrusted at checkout. Duplicate IDs are rejected
 * rather than merged, because the reducer already guarantees one line per
 * product and a malformed cart must not silently change an order.
 */
export function validateCartForCheckout(cartItems, catalog = storeCatalog) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return {
            isValid: false,
            error: "Your cart is empty. Add a demo product before checkout.",
            items: [],
        };
    }

    const inventory = validateCartAgainstInventory(cartItems);
    if (!inventory.isValid) return { ...inventory, items: [] };

    const seenProductIds = new Set();
    const items = [];

    for (const cartItem of cartItems) {
        const productId = cartItem?.productId;
        const quantity = cartItem?.quantity;

        if (
            typeof productId !== "string" ||
            productId.trim() === "" ||
            seenProductIds.has(productId)
        ) {
            return {
                isValid: false,
                error: "Your cart contains an invalid or duplicate product.",
                items: [],
            };
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > MAX_CART_QUANTITY
        ) {
            return {
                isValid: false,
                error: "Your cart contains an invalid product quantity.",
                items: [],
            };
        }

        const line = createCartLine(
            resolveEligibleDemoProduct(productId, catalog),
            quantity
        );

        if (!line) {
            return {
                isValid: false,
                error: "Your cart contains a product unavailable for demo checkout.",
                items: [],
            };
        }

        seenProductIds.add(productId);
        items.push(line);
    }

    return {
        isValid: true,
        error: null,
        items,
    };
}
