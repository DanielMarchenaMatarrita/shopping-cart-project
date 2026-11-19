export function getCartLineSubtotal(item) {
    const unitPrice = Number.isInteger(item?.unitPrice) ? item.unitPrice : 0;
    const quantity = Number.isInteger(item?.quantity) ? item.quantity : 0;

    return unitPrice * quantity;
}

export function getCartItemCount(items = []) {
    return items.reduce(
        (count, item) =>
            count + (Number.isInteger(item.quantity) ? item.quantity : 0),
        0
    );
}

export function getCartSubtotal(items = []) {
    return items.reduce(
        (subtotal, item) => subtotal + getCartLineSubtotal(item),
        0
    );
}

export function getCartTotal(items = []) {
    // No taxes, shipping, or discounts exist in this phase.
    return getCartSubtotal(items);
}

export function getCartLineCount(items = []) {
    return items.length;
}
