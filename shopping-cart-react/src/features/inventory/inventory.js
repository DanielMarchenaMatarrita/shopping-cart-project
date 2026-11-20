import { demoInventory } from "../../data/demoInventory.js";
import { storeCatalog } from "../../data/storeCatalog.js";

export const MAX_CART_QUANTITY = 99;

export function getAvailableStock(productId, inventory = demoInventory) {
    const product = storeCatalog.find((entry) => entry.id === productId && entry.isDemo === true && entry.available === true);
    const record = Object.hasOwn(inventory, productId) ? inventory[productId] : null;
    if (!product || !record || record.productId !== productId || record.unit !== product.unit ||
        !Number.isSafeInteger(record.availableQuantity) || record.availableQuantity < 0 ||
        (record.lowStockThreshold !== undefined &&
            (!Number.isSafeInteger(record.lowStockThreshold) || record.lowStockThreshold < 0))) return null;
    return record.availableQuantity;
}

export function getInventoryStatus(productId, inventory = demoInventory) {
    const stock = getAvailableStock(productId, inventory);
    if (stock === null) return "unavailable";
    if (stock === 0) return "out_of_stock";
    return stock <= (inventory[productId].lowStockThreshold ?? 0) ? "low_stock" : "in_stock";
}

export function canAddToCart(productId, currentQuantity, requestedQuantity, inventory = demoInventory) {
    const stock = getAvailableStock(productId, inventory);
    return stock !== null && Number.isInteger(currentQuantity) && currentQuantity >= 0 &&
        Number.isInteger(requestedQuantity) && requestedQuantity > 0 &&
        currentQuantity + requestedQuantity <= Math.min(stock, MAX_CART_QUANTITY);
}

export function getRemainingStock(productId, cartQuantity, inventory = demoInventory) {
    const stock = getAvailableStock(productId, inventory);
    if (stock === null || !Number.isInteger(cartQuantity) || cartQuantity < 0) return null;
    return Math.max(0, stock - cartQuantity);
}

export function validateCartAgainstInventory(items, inventory = demoInventory) {
    if (!Array.isArray(items)) return { isValid: false, error: "Invalid cart." };
    const seen = new Set();
    for (const item of items) {
        if (seen.has(item?.productId) || !canAddToCart(item?.productId, 0, item?.quantity, inventory)) {
            return { isValid: false, error: "A cart quantity exceeds fictional demo stock or is unavailable. Please update your cart." };
        }
        seen.add(item.productId);
    }
    return { isValid: true, error: null };
}
