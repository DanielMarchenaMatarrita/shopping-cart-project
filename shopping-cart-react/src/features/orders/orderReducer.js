import { canTransition, sanitizeOrder } from "./orderDomain.js";

export function orderReducer(state, action) {
    if (action?.type === "REPLACE") {
        return { orders: action.orders };
    }
    if (action?.type === "ADD") {
        const order = sanitizeOrder(action.order);
        if (!order || state.orders.some((entry) => entry.id === order.id)) return state;
        return { orders: [order, ...state.orders] };
    }
    if (action?.type === "TRANSITION") {
        const order = state.orders.find((entry) => entry.id === action.id);
        if (!order || !canTransition(order.status, action.status)) return state;
        return { orders: state.orders.map((entry) => entry.id === order.id ? Object.freeze({ ...entry, status: action.status }) : entry) };
    }
    return state;
}

export function selectOrders(orders, status = "all") {
    return orders.filter((order) => status === "all" || order.status === status)
        .slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
}
