import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { CartContext } from "./cartContext";
import {
    cartReducer,
    initialCartState,
} from "./cartReducer";
import {
    getCartItemCount,
    getCartSubtotal,
    getCartTotal,
} from "./cartSelectors";
import {
    loadCartFromStorage,
    saveCartToStorage,
    serializeCartItems,
} from "./cartStorage";

function initializeCart() {
    return loadCartFromStorage().state;
}

export default function CartProvider({ children }) {
    const [state, dispatch] = useReducer(
        cartReducer,
        initialCartState,
        initializeCart
    );
    const lastSerializedItems = useRef(serializeCartItems(state.items));

    useEffect(() => {
        const serializedItems = serializeCartItems(state.items);

        // Lazy hydration already supplied this state. Skipping an identical
        // initial write prevents corrupt or future-version data from being
        // overwritten before the user changes their cart.
        if (serializedItems === lastSerializedItems.current) return;

        const result = saveCartToStorage(state.items);

        if (result.ok) {
            lastSerializedItems.current = serializedItems;
        }
    }, [state.items]);

    const addItem = useCallback((product, quantity = 1) => {
        dispatch({
            type: "ADD_ITEM",
            payload: { product, quantity },
        });
    }, []);

    const incrementQuantity = useCallback((productId) => {
        dispatch({
            type: "INCREMENT_QUANTITY",
            payload: { productId },
        });
    }, []);

    const decrementQuantity = useCallback((productId) => {
        dispatch({
            type: "DECREMENT_QUANTITY",
            payload: { productId },
        });
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { productId, quantity },
        });
    }, []);

    const removeItem = useCallback((productId) => {
        dispatch({
            type: "REMOVE_ITEM",
            payload: { productId },
        });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: "CLEAR_CART" });
    }, []);

    const value = useMemo(() => {
        const items = state.items;

        return {
            items,
            itemCount: getCartItemCount(items),
            subtotal: getCartSubtotal(items),
            total: getCartTotal(items),
            addItem,
            incrementQuantity,
            decrementQuantity,
            updateQuantity,
            removeItem,
            clearCart,
        };
    }, [
        state.items,
        addItem,
        incrementQuantity,
        decrementQuantity,
        updateQuantity,
        removeItem,
        clearCart,
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
