import "./ItemCard.css";
import { Link, useLocation } from "react-router";
import { categories } from "../data/categories";
import { isPurchasable } from "../data/catalogSelectors";
import {
  getProductEmoji,
  getProductEmojiLabel,
} from "../data/productEmojis";
import { formatCrc } from "../utils/formatCurrency";

const labels = Object.fromEntries(categories.map(({ id, label }) => [id, label]));

export default function ItemCard({ item, mode = "reference", onViewDetails, onAddToCart }) {
  const forSale = mode === "store" && item.isDemo === true && isPurchasable(item);
  const imageSrc = item.media?.imageUrl ?? item.image ?? null;
  const imageAlt = item.media?.alt ?? `Imagen de ${item.name}`;
  const location = useLocation();
  const detailsPath = `/products/${encodeURIComponent(item.id)}`;
  const detailsState = {
    from: `${location.pathname}${location.search}`,
  };

  return (
    <article className="item-card">
      <div className="item-card__media">
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} loading="lazy" onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.nextElementSibling.hidden = false;
          }} />
        ) : null}
        <div
          className="item-card__placeholder"
          hidden={Boolean(imageSrc)}
          role="img"
          aria-label={`${getProductEmojiLabel(item)}. Product photography pending verification.`}
        >
          <span aria-hidden="true">{getProductEmoji(item)}</span>
          <small>Photography pending verification</small>
        </div>
      </div>
      <div className="item-card__body">
        <div className="item-card__meta">
          <span className="item-card__category">{labels[item.categoryId] ?? "Other"}</span>
          <span className={`item-card__badge${forSale ? " item-card__badge--demo" : ""}`}>
            {forSale ? "Demo store" : "Reference only"}
          </span>
        </div>
        <h2 className="item-card__title">
          <Link
            className="item-card__title-link"
            to={detailsPath}
            state={detailsState}
          >
            {item.name}
          </Link>
        </h2>
        <p className="item-card__subtitle">{item.unit ? `Sale unit: ${item.unit}` : "Sale unit pending confirmation"}</p>
        {forSale && (
          <p className="item-card__price">
            {formatCrc(item.price)} <small>fictional price</small>
          </p>
        )}
        <div className="item-card__actions">
          <Link
            className="item-card__details"
            to={detailsPath}
            state={detailsState}
            aria-label={`View details for ${item.name}`}
          >
            View details
          </Link>
          {typeof onViewDetails === "function" && (
            <button
              type="button"
              className="item-card__quick-view"
              onClick={() => onViewDetails(item)}
              aria-label={`Quick view ${item.name}`}
            >
              Quick view
            </button>
          )}
          {forSale && typeof onAddToCart === "function" && (
            <button type="button" className="item-card__buy" onClick={() => onAddToCart(item)}>Add to cart</button>
          )}
        </div>
      </div>
    </article>
  );
}
