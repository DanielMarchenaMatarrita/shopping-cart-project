// CRC amounts are stored as integer colones throughout the demo.
// Keep formatting at the presentation boundary, never in arithmetic.
const crcFormatter = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export function formatCrc(value) {
    return crcFormatter.format(Number.isFinite(value) ? value : 0);
}
