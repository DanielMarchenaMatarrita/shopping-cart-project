import "./ItemCard.css";
import { categories } from "../data/categories";
import { isPurchasable } from "../data/catalogSelectors";

const labels = Object.fromEntries(categories.map(({ id, label }) => [id, label]));
const categoryIcons = {
  "frutas-tropicales": "🥭", citricos: "🍋", "frutas-berries": "🍓",
  "frutas-importadas": "🍎", "bananos-platanos": "🍌",
  "hortalizas-fruto": "🍅", "hojas-hierbas": "🥬",
  "raices-tuberculos": "🥕", "bulbos-condimentos": "🧄",
  cruciferas: "🥦", "granos-leguminosas": "🌽",
};
const crc = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" });

export default function ItemCard({ item, mode = "reference", onViewDetails, onAddToCart }) {
  const forSale = mode === "store" && isPurchasable(item);
  const imageSrc = item.media?.imageUrl ?? item.image ?? null;
  const imageAlt = item.media?.alt ?? `Imagen de ${item.name}`;
  return (
    <article className="item-card">
      <div className="item-card__media">
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} loading="lazy" onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.nextElementSibling.hidden = false;
          }} />
        ) : null}
        <div className="item-card__placeholder" hidden={Boolean(imageSrc)} aria-hidden="true">
          <span>{categoryIcons[item.categoryId] ?? "🌱"}</span>
          <small>Image pending verification</small>
        </div>
      </div>
      <div className="item-card__body">
        <div className="item-card__meta">
          <span className="item-card__category">{labels[item.categoryId] ?? "Other"}</span>
          <span className="item-card__badge">{forSale ? "In store" : "Reference only"}</span>
        </div>
        <h2 className="item-card__title">{item.name}</h2>
        <p className="item-card__subtitle">{item.unit ? `Sale unit: ${item.unit}` : "Sale unit pending confirmation"}</p>
        {forSale && <p className="item-card__price">{crc.format(item.price)}</p>}
        <div className="item-card__actions">
          <button type="button" className="item-card__details" onClick={() => onViewDetails(item)}>View details</button>
          {forSale && typeof onAddToCart === "function" && (
            <button type="button" className="item-card__buy" onClick={() => onAddToCart(item)}>Add to cart</button>
          )}
        </div>
      </div>
    </article>
  );
}
