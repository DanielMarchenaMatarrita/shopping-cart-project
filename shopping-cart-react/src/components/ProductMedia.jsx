import { useState } from "react";
import { getProductMedia } from "../data/productMediaResolver";
import "./ProductMedia.css";

export default function ProductMedia({ product, compact = false }) {
    const media = getProductMedia(product);

    return <ProductVisual key={product.id} media={media} compact={compact} />;
}

function ProductVisual({ media, compact }) {
    const [failed, setFailed] = useState(false);
    const { photo, emoji } = media;
    const showPhoto = photo && !failed;

    if (!photo && !compact) {
        return <span className="product-media__emoji" aria-hidden="true">{emoji}</span>;
    }

    return (
        <figure className={`product-media${compact ? " product-media--card" : ""}`}>
            <div className="product-media__frame">
                {showPhoto ? (
                    <img
                        src={`${import.meta.env.BASE_URL}${photo.imagePath}`}
                        alt={photo.altText}
                        width={photo.width}
                        height={photo.height}
                        loading={compact ? "lazy" : "eager"}
                        decoding="async"
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <div className="product-media__fallback">
                        <span className="product-media__emoji" aria-hidden="true">{emoji}</span>
                        <small>{failed ? "Photo unavailable" : "Photography pending verification"}</small>
                    </div>
                )}
            </div>
            {showPhoto && (
                <figcaption className="product-media__credit">
                    <a href={photo.sourcePageUrl}>{photo.attributionText}</a>
                    {" · "}<a href={photo.licenseUrl}>{photo.licenseName}</a>
                    {" · Resized and recompressed. Illustrative photo."}
                </figcaption>
            )}
        </figure>
    );
}
