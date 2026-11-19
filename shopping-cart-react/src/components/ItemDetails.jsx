
import { useEffect, useRef } from "react";
import { categories } from "../data/categories";

export default function ItemDetails({ item, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  const category =
    categories.find((entry) => entry.id === item.categoryId)
      ?.label ?? "Other";

  return (
    <dialog
      ref={dialogRef}
      className="item-dialog"
      onCancel={onClose}
      aria-labelledby="item-dialog-title"
    >
      <div className="item-dialog__header">
        <h2 id="item-dialog-title">{item.name}</h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
        >
          ✕
        </button>
      </div>

      <dl>
        <dt>Category</dt>
        <dd>{category}</dd>

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

      <p className="item-dialog__notice">
        CENADA reference information does not establish
        current stock, pricing, or retail availability.
      </p>
    </dialog>
  );
}
