import { useEffect, useRef } from "react";
import ProductInformation from "./ProductInformation";
import ProductMedia from "./ProductMedia";
import DemoStock from "./DemoStock";

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

      <ProductMedia product={item} />
      {item.isDemo && <DemoStock productId={item.id} />}
      <ProductInformation item={item} />
    </dialog>
  );
}
