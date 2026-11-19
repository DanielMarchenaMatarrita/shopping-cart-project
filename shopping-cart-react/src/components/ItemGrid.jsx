import ItemCard from "./ItemCard";

export default function ItemGrid({ items, mode = "reference", label = "Agricultural product catalog", onViewDetails, onAddToCart }) {
  if (items.length === 0) return <p className="empty-results">No matching products. Try another search or category.</p>;
  return (
    <section className="item-grid" aria-label={label}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} mode={mode} onViewDetails={onViewDetails} onAddToCart={onAddToCart} />
      ))}
    </section>
  );
}
