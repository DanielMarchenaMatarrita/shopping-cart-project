import { useDemoStock } from "../features/inventory/useDemoStock";

export default function DemoStock({ productId }) {
    const { stock, status, canAdd } = useDemoStock(productId);
    const label = status === "unavailable" ? "Unavailable" :
        status === "out_of_stock" ? "Out of stock" :
        status === "low_stock" ? `Low stock: ${stock} available` : `In stock: ${stock} available`;
    return <p className="demo-stock" role="status">Fictional demo stock: {label}.{!canAdd && stock > 0 && " Cart quantity limit reached."}</p>;
}
