import { categories } from "./categories";

export function getCategoryLabel(categoryId) {
  return categories.find((category) => category.id === categoryId)?.label ?? "Other";
}

export function filterCatalog(items, { query = "", categoryId = "all" } = {}) {
  const normalized = query.trim().toLocaleLowerCase("es-CR");
  return items.filter((item) => {
    const matchesCategory = categoryId === "all" || item.categoryId === categoryId;
    const matchesText = item.name.toLocaleLowerCase("es-CR").includes(normalized);
    return matchesCategory && matchesText;
  });
}

export function isPurchasable(item) {
  return item.available === true && Number.isFinite(item.price) && item.price > 0 && Boolean(item.unit);
}
