import ItemCard from "./ItemCard";

export default function ItemGrid({ items, mode = "reference", onViewDetails, onAddToCart }) {
  if (items.length === 0) return <p className="empty-results">No matching products. Try another search or category.</p>;
  return (
    <section className="item-grid" aria-label="Agricultural product catalog">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} mode={mode} onViewDetails={onViewDetails} onAddToCart={onAddToCart} />
      ))}
    </section>
  );
}
