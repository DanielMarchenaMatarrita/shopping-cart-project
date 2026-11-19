import { getCategoryLabel } from "../data/catalogSelectors";
import { formatCrc } from "../utils/formatCurrency";

export default function ProductInformation({ item }) {
    const isDemo = item.isDemo === true;
    const sourceStatus = isDemo
        ? "Fictional demo data"
        : item.sourceStatus ?? "Not verified";

    return (
        <>
            {isDemo && (
                <p className="product-info__demo">
                    Demo store product — fictional price and availability
                </p>
            )}

            <dl className="product-info">
                <dt>Category</dt>
                <dd>{getCategoryLabel(item.categoryId)}</dd>

                <dt>{isDemo ? "Demo product ID" : "Reference ID"}</dt>
                <dd>{item.id}</dd>

                <dt>Catalog status</dt>
                <dd>
                    {isDemo
                        ? "Fictional demo store item — not real inventory"
                        : "Reference data — not store inventory"}
                </dd>

                <dt>Sale unit</dt>
                <dd>{item.unit ?? "Pending confirmation"}</dd>

                <dt>{isDemo ? "Demo price" : "Retail price"}</dt>
                <dd>
                    {isDemo && Number.isInteger(item.price)
                        ? `${formatCrc(item.price)} per ${item.unit ?? "unit"}`
                        : "Not available"}
                </dd>

                <dt>Source status</dt>
                <dd>{sourceStatus}</dd>

                {item.sourceNote && (
                    <>
                        <dt>Source note</dt>
                        <dd>{item.sourceNote}</dd>
                    </>
                )}

                {item.currency && (
                    <>
                        <dt>Currency</dt>
                        <dd>
                            {isDemo
                                ? `${item.currency} (integer colones)`
                                : item.currency}
                        </dd>
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
                {isDemo
                    ? "Fictional demo information for shopping-cart testing. Not a real Tropical Fruits & Veggies offer, price, or inventory record."
                    : "CENADA reference information does not establish current stock, pricing, or retail availability."}
            </p>
        </>
    );
}
