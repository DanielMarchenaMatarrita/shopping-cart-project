import { useContext } from "react";
import { OrdersContext } from "./ordersContext";
export function useOrders() {
    const context = useContext(OrdersContext);
    if (!context) throw new Error("useOrders requires OrdersProvider");
    return context;
}
