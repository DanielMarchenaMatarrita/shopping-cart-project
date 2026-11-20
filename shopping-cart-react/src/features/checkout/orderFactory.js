import { getCartSubtotal, getCartTotal } from "../cart/cartSelectors.js";
import {
    validateCartForCheckout,
    validateCheckoutForm,
} from "./checkoutValidation.js";

export function createDemoOrder(cartItems, checkoutData, catalog) {
    const cart = validateCartForCheckout(cartItems, catalog);
    const form = validateCheckoutForm(checkoutData);

    if (!cart.isValid || !form.isValid) {
        return {
            ok: false,
            errors: {
                ...(cart.isValid ? {} : { cart: cart.error }),
                ...form.errors,
            },
        };
    }

    const items = cart.items.map((item) =>
        Object.freeze({
            productId: item.productId,
            name: item.name,
            unit: item.unit,
            unitPrice: item.unitPrice,
            currency: item.currency,
            quantity: item.quantity,
            lineSubtotal: item.unitPrice * item.quantity,
        })
    );
    const subtotal = getCartSubtotal(items);

    return {
        ok: true,
        order: Object.freeze({
            demoReference: "LOCAL-DEMO-ORDER",
            isDemo: true,
            customerName: form.value.customerName,
            deliveryMethod: form.value.deliveryMethod,
            notes: form.value.notes,
            currency: "CRC",
            items: Object.freeze(items),
            subtotal,
            total: getCartTotal(items),
        }),
    };
}

export function isDemoOrderSnapshot(order) {
    return (
        order?.isDemo === true &&
        order.demoReference === "LOCAL-DEMO-ORDER" &&
        order.currency === "CRC" &&
        Array.isArray(order.items) &&
        Number.isInteger(order.subtotal) &&
        Number.isInteger(order.total) &&
        order.total === order.subtotal
    );
}
