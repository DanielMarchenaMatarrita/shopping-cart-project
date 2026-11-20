# Demo administration dashboard

`/admin` is public, frontend-only, and clearly marked as simulated. It is not an authenticated administration system. It projects the existing demo inventory dataset and `OrdersProvider` state through pure functions in `src/features/dashboard/dashboardSelectors.js`; no additional dashboard state or storage is created.

## Definitions

- Eligible fictional demo products are counted once per ID. Existing inventory selectors assign mutually exclusive in-stock, low-stock, out-of-stock, or unavailable categories. Reference products are excluded.
- A stock-unit total is shown only when all eligible inventory is valid, its units are homogeneous, and the integer total is safe. Unavailable items get alerts; no unknown stock is treated as unlimited.
- Orders are sanitized using the existing order-domain validator; malformed or duplicate IDs are excluded. Counts are grouped by their current lifecycle status.
- Historical simulated total sums stored order snapshots across all statuses. Average is rounded to the nearest whole CRC using `Math.round`; empty history yields zero. Simulated ordered units sum historical quantities, not actual sales.
- Recent orders reuse the order selector's newest-first ordering with descending ID as the deterministic timestamp tie-breaker. Links lead to existing order details.
- If order history storage cannot be read, order metrics are hidden rather than presented as zero. Arithmetic that exceeds safe integer precision is shown as unavailable.

The dashboard never writes inventory or order history. It reflects order changes through the existing provider and restores validated data through its existing storage layer after reload. Browser-local data is editable, has no reliable cross-tab synchronization or multi-user transaction guarantees, and cannot be trusted for production inventory. Simulated totals are neither real revenue nor payments.

## Learning notes / notas de aprendizaje

- **Administration dashboard:** a view of operational information. *Panel de administración: vista de información operativa.*
- **Derived state:** values calculated from existing state rather than independently saved. *Datos derivados, no duplicados.*
- **Selector:** a pure function that extracts or computes information. *Un selector consulta y transforma datos.*
- **Aggregation:** combining records into counts and totals. *Agregación: sumar y contar registros.*
- **Operational metric:** a measured activity or condition, such as pending demo orders. *Una métrica operativa describe un estado.*
- **KPI:** a metric selected to evaluate a meaningful objective; fictional demo values are not real business KPIs. *Un indicador clave requiere un objetivo real.*
- **Single source of truth:** the inventory dataset and order provider remain authoritative for this simulation. *Una sola fuente evita inconsistencias.*
- **Data projection:** a tailored read-only representation of domain data. *Una proyección presenta los datos según la necesidad.*
- **Empty state:** an honest explanation when no orders exist. *El estado vacío no inventa transacciones.*
- **Data integrity:** validation, immutable inputs, safe arithmetic and explicit unavailable states prevent misleading displays. *La integridad evita resultados engañosos.*

## Validation

`node --test tests/inventory.test.js tests/orders.test.js tests/dashboard.test.js` passed 12 tests; `pnpm lint` and `pnpm build` passed. Selector tests cover inventory boundaries, invalid data, order counts, rounding, ordering, and projections after recording, transition, and storage reload.

Headless Chrome checked empty and populated dashboards, inventory counts, a catalog photo, cart and checkout, recent-order links, status changes through completion, restored metrics, orders navigation, storage-read error messaging, and 390px dashboard layout. A Tab key check reached a navigation link; a complete keyboard and screen-reader audit was not performed.
