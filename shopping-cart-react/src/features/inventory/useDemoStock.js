import { canAddToCart, getAvailableStock, getInventoryStatus } from "./inventory";
import { useCart } from "../cart/useCart";

export function useDemoStock(productId) {
    const { items } = useCart();
    const quantity = items.find((item) => item.productId === productId)?.quantity ?? 0;
    return {
        stock: getAvailableStock(productId),
        status: getInventoryStatus(productId),
        canAdd: canAddToCart(productId, quantity, 1),
        quantity,
    };
}
