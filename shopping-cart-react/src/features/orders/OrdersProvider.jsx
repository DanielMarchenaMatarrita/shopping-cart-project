import { useCallback, useMemo, useReducer } from "react";
import { orderReducer } from "./orderReducer";
import { loadOrders } from "./orderStorage";
import { advanceHistoricalOrder, recordHistoricalOrder } from "./orderOperations";
import { OrdersContext } from "./ordersContext";

function initialize() {
    const result = loadOrders();
    return { orders: result.orders, storageStatus: result.ok ? null : result.status };
}

export default function OrdersProvider({ children }) {
    const [state, dispatch] = useReducer(orderReducer, undefined, initialize);

    const recordOrder = useCallback((snapshot, id, createdAt) => {
        const result = recordHistoricalOrder(snapshot, id, createdAt);
        if (result.ok) dispatch({ type: "REPLACE", orders: result.orders });
        return result;
    }, []);

    const advanceOrder = useCallback((id, status) => {
        const result = advanceHistoricalOrder(id, status);
        if (result.ok) dispatch({ type: "REPLACE", orders: result.orders });
        return result;
    }, []);

    const value = useMemo(() => ({ ...state, recordOrder, advanceOrder }), [state, recordOrder, advanceOrder]);
    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}
