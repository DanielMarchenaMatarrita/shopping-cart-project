# Simulated order history and lifecycle

This feature is browser-local educational data, not a real commercial transaction. A cart is a mutable selection validated against current demo catalog prices and simulated stock. A simulated order is a historical snapshot created only after checkout validation. A real order would require trusted server-side transaction processing, inventory coordination, authentication and other safeguards absent here.

## Model and lifecycle

Version 1 stores `{ version: 1, orders: [...] }` under `shopping-cart-project:orders:v1`. Each order contains a random `local-demo-` ID, UTC creation time, status, `isDemo`, `CRC`, simulated fulfillment method, historical item IDs, names, units, integer prices, quantities and line subtotals, plus subtotal and total. It excludes checkout names, notes and other customer-entered data. The confirmation route carries only an ID, not the form.

Sanitization reconstructs allowlisted objects, checks totals, unique item IDs, quantities, timestamps and status, and freezes each snapshot and its items. It intentionally does not reprice historical orders or require today's catalog/stock to match yesterday's snapshot. Any malformed stored record invalidates the stored history for this session rather than silently rewriting or discarding it. Extra fields are stripped from in-memory records and never intentionally written.

The only transitions are `pending → preparing → ready → completed`. The last state is terminal; cancellation is not implemented. The reducer validates transitions and returns new records while retaining historical item snapshots. Controls are simulation tools, not administrator authorization.

## Checkout and persistence policy

Review validates form, cart, stock and authoritative prices. Confirmation repeats validation, constructs a sanitized order and synchronously writes it to storage. Only after a successful write does it clear the cart and navigate to confirmation. A ref blocks repeated clicks and a random ID is reused for retries of the same review; the storage operation treats the same ID and snapshot as idempotent and rejects conflicting reuse. React rendering and Strict Mode do not record orders.

If storage access, parsing, schema validation or writing fails, confirmation is blocked and the cart remains. Corrupt and unsupported-version data are not overwritten. The app requires `crypto.randomUUID()` for a local ID; if unavailable, confirmation is blocked. No automatic reset of incompatible data is provided. No stock is reserved or deducted.

These are best-effort operations, **not an atomic transaction**: storage writing and the separate cart persistence effect can be interrupted independently. Tabs can race between reading and writing the shared localStorage key; localStorage provides no cross-tab transaction or trustworthy authorization. History is editable/deletable in the browser and is not synchronized. No client-side check can establish a real order or prevent tampering.

## Concepts / notas de aprendizaje

- **Order aggregate:** the order, its line snapshots and lifecycle rules form one conceptual boundary. *El pedido agrupa líneas y reglas de estado.*
- **Immutable snapshot:** historical values are copied and not changed by catalog edits. *Una copia histórica no cambia con el catálogo.*
- **Order lifecycle / finite state machine:** a finite set of states and allowed edges. *El ciclo de vida define estados y transiciones válidas.*
- **Status transition:** one permitted move between adjacent states. *No se permiten saltos ni retrocesos.*
- **Historical pricing:** prices are captured at confirmation, not recalculated for history. *El precio histórico permanece fijo.*
- **Persistence schema:** versioned representation validated at the storage boundary. *El esquema versionado protege la lectura de datos.*
- **Idempotency:** repeating the same confirmation ID and snapshot does not create another record. *Repetir la misma operación no duplica el pedido.*
- **Data minimization:** store only the fields required for the simulation. *No se guardan nombres ni notas del cliente.*
- **Client-side trust boundary:** browser data can be altered and cannot prove commercial validity. *El navegador no es una fuente confiable para transacciones reales.*

## Validation

`node --test tests/orders.test.js tests/inventory.test.js` passed all eight tests; `pnpm lint` and `pnpm build` passed. Automated domain tests exercise lifecycle, sanitization, idempotency, storage errors and historical totals.

Headless Chrome exercised an empty history, catalog add, checkout review and confirmation, saved-order detail, pending-to-preparing transition, status filter, refresh persistence, and browser Back/Forward. It also checked the history page for horizontal overflow at 390 px and verified one stored record without the checkout name. Other mobile pages, the remaining lifecycle controls in the browser, storage-failure UI, full catalog/media regressions and assistive-technology testing were not exercised in this phase.
