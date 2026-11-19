import { getCategoryLabel } from "../data/catalogSelectors";

export default function ProductInformation({ item }) {
    return (
        <>
            <dl className="product-info">
                <dt>Category</dt>
                <dd>{getCategoryLabel(item.categoryId)}</dd>

                <dt>Reference ID</dt>
                <dd>{item.id}</dd>

                <dt>Catalog status</dt>
                <dd>Reference data — not store inventory</dd>

                <dt>Sale unit</dt>
                <dd>{item.unit ?? "Pending confirmation"}</dd>

                <dt>Retail price</dt>
                <dd>Not available</dd>

                <dt>Source status</dt>
                <dd>{item.sourceStatus ?? "Not verified"}</dd>

                {item.sourceNote && (
                    <>
                        <dt>Source note</dt>
                        <dd>{item.sourceNote}</dd>
                    </>
                )}

                {item.currency && (
                    <>
                        <dt>Reference currency</dt>
                        <dd>{item.currency}</dd>
                    </>
                )}
            </dl>

            {item.sourceUrl && (
                <p>
                    <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View original reference source
                    </a>
                </p>
            )}

            <p className="product-info__notice">
                CENADA reference information does not establish current stock,
                pricing, or retail availability.
            </p>
        </>
    );
}
