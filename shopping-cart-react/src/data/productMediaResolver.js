import { getProductEmoji } from "./productEmojis.js";
import { productMedia } from "./productMedia.js";

export function getProductMedia(product) {
    const entry = product?.isDemo === true && Object.hasOwn(productMedia, product.id)
        ? productMedia[product.id]
        : null;
    const approved = entry?.verificationStatus === "verified" &&
        entry.rightsStatus === "verified" &&
        ["cultivar", "product"].includes(entry.identityLevel) &&
        /^images\/products\/[a-z0-9-]+\.jpg$/.test(entry.imagePath) &&
        [entry.width, entry.height].every((size) => Number.isInteger(size) && size > 0) &&
        Boolean(entry.altText && entry.attributionText && entry.sourcePageUrl && entry.licenseUrl);

    return {
        photo: approved ? entry : null,
        verificationStatus: entry?.verificationStatus ?? "unreviewed",
        emoji: getProductEmoji(product),
    };
}
