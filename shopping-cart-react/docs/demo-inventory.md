# Simulated inventory

This is fictional, read-only browser data, not Tropical Fruits & Veggies inventory. `src/data/demoInventory.js` maps the five demo product IDs (demo SKUs) to whole-unit quantities and thresholds, separately from catalog metadata and reference entries. No inventory overview or provider is necessary while stock is static.

| Demo SKU | Quantity | Threshold | Status |
| --- | ---: | ---: | --- |
| DEMO-001 | 12 | 3 | in stock |
| DEMO-002 | 3 | 3 | low stock |
| DEMO-003 | 0 | 3 | out of stock |
| DEMO-004 | 20 | 3 | in stock |
| DEMO-005 | 8 | 3 | in stock |

Zero is out of stock; positive quantities at or below the threshold are low; greater quantities are in stock. A missing threshold defaults to zero. Unknown IDs, non-demo products, invalid records, and unit mismatches are unavailable, not unlimited. Cart quantities are integers from 1 to 99 and may not exceed stock. The pure inventory functions enforce these rules in the cart reducer as well as checkout; disabled controls are not the security boundary.

Version-1 storage is unchanged. Hydration rebuilds lines from current catalog metadata, merges duplicate IDs, clamps to stock and 99, removes zero/missing-stock lines, and displays a notice when stock or the maximum caused an adjustment. Invalid records are ignored. Corrupt, unsupported, or inaccessible storage yields an empty cart without an initial overwrite. The adjusted cart is persisted on a later cart change.

Checkout checks inventory at review and again at confirmation, reconstructs current prices, and only clears the cart after a valid immutable fictional order snapshot is created. Stock is neither reserved nor deducted. Static data cannot change during a running session except through a new deployment; this is not multi-user inventory management.

## Concepts / notas de aprendizaje

- **Inventory record:** quantity and unit associated with a demo product. *Registro de inventario: cantidad separada del catálogo.*
- **SKU:** identifier for a store item; here the existing demo ID serves this role. *SKU: identificador de producto comercial.*
- **Available stock:** simulated quantity offered for testing. *Existencias disponibles ficticias.*
- **Low-stock threshold:** inclusive boundary for a warning. *Umbral de pocas unidades, incluido en el aviso.*
- **Stock validation:** checking quantity against authoritative simulated data. *Validación de existencias antes de modificar el carrito.*
- **Inventory state:** the shared read-only dataset, not a copy in each cart line. *Estado de inventario centralizado.*
- **Cart quantity:** intended purchase quantity, not inventory. *Cantidad solicitada no es existencia.*
- **Business invariants:** quantities remain whole, positive and within both limits. *Reglas que siempre deben cumplirse.*
- **Client-side validation:** useful for demonstration and feedback but cannot prevent tampering or overselling in real multi-user commerce. *La validación del navegador no garantiza existencias reales.*
- **Reservation vs. deduction:** reservation holds units; deduction reduces stock after a transaction. This simulation does neither. *No se reserva ni se descuenta inventario.*

## Validation

Run `node --test tests/inventory.test.js`, `pnpm lint`, and `pnpm build`. Browser and assistive-technology verification should be performed separately; pure tests do not establish layout or navigation behavior.
