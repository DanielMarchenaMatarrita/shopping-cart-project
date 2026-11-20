// Unicode visual identifiers, not verified botanical images or photography.
// Exact product names are normalized before lookup; no substring matching is
// used so cultivars and similarly named products remain predictable.
const exactProductEmojis = {
    "aguacate hass": "🥑",
    manga: "🥭",
    maracuya: "🥭",
    papaya: "🥭",
    pina: "🍍",
    sandia: "🍉",
    "limon mandarino": "🍋",
    "limon mesino": "🍋",
    naranja: "🍊",
    fresa: "🍓",
    mora: "🫐",
    "banano criollo": "🍌",
    "platano verde": "🍌",
    "ayote sazon": "🎃",
    "ayote tierno": "🎃",
    "chayote sazon blanco": "🥒",
    "chayote tierno criollo": "🥒",
    "chayote tierno quelite": "🥒",
    "chile dulce": "🫑",
    pepino: "🥒",
    tomate: "🍅",
    vainica: "🫛",
    zapallo: "🎃",
    "apio verde": "🌿",
    "culantro castilla": "🌿",
    "lechuga americana": "🥬",
    "lechuga criolla": "🥬",
    "repollo verde": "🥬",
    camote: "🥔",
    nampi: "🥔",
    papa: "🥔",
    remolacha: "🥕",
    tiquisque: "🥔",
    "yuca parafinada": "🥔",
    zanahoria: "🥕",
    "cebolla suelta": "🧅",
    "cebolla trenza": "🧅",
    brocoli: "🥦",
    coliflor: "🥦",
    elote: "🌽",
    guayaba: "🥭",
    guanabana: "🥭",
    cas: "🍏",
    granadilla: "🥭",
    carambola: "🍋",
    tamarindo: "🫛",
    jocote: "🍎",
    nance: "🥭",
    rambutan: "🍒",
    pitahaya: "🥭",
    coco: "🥥",
    zapote: "🥭",
    caimito: "🥭",
    melon: "🍈",
    mamon: "🍇",
    mandarina: "🍊",
    toronja: "🍊",
    "limon criollo": "🍋",
    "lima dulce": "🍋",
    arandano: "🫐",
    "manzana roja": "🍎",
    "manzana verde": "🍏",
    pera: "🍐",
    "uva roja": "🍇",
    "uva verde": "🍇",
    kiwi: "🥝",
    durazno: "🍑",
    ciruela: "🍑",
    nectarina: "🍑",
    cereza: "🍒",
    banano: "🍌",
    "platano maduro": "🍌",
    "banano datil": "🍌",
    "guineo cuadrado": "🍌",
    "tomate cherry": "🍅",
    "chile picante": "🌶️",
    "chile jalapeno": "🌶️",
    zucchini: "🥒",
    berenjena: "🍆",
    okra: "🫛",
    "lechuga romana": "🥬",
    espinaca: "🥬",
    acelga: "🥬",
    "repollo morado": "🥬",
    kale: "🥬",
    "culantro coyote": "🌿",
    perejil: "🌿",
    cebollino: "🌿",
    hierbabuena: "🌿",
    albahaca: "🌿",
    yuca: "🥔",
    name: "🥔",
    malanga: "🥔",
    jengibre: "🫚",
    curcuma: "🫚",
    rabano: "🥕",
    ajo: "🧄",
    "cebolla morada": "🧅",
    "cebolla blanca": "🧅",
    puerro: "🧅",
    oregano: "🌿",
    romero: "🌿",
    tomillo: "🌿",
    "col de bruselas": "🥬",
    "frijol rojo": "🫘",
    "frijol negro": "🫘",
    "frijol tierno": "🫛",
    arveja: "🫛",
    garbanzo: "🫘",
    "maiz dulce": "🌽",
    "mango tommy atkins": "🥭",
    "pina golden": "🍍",
    "papaya solo": "🥭",
};

export const categoryEmojis = Object.freeze({
    "frutas-tropicales": "🥭",
    citricos: "🍋",
    "frutas-berries": "🍓",
    "frutas-importadas": "🍎",
    "bananos-platanos": "🍌",
    "hortalizas-fruto": "🍅",
    "hojas-hierbas": "🥬",
    "raices-tuberculos": "🥔",
    "bulbos-condimentos": "🧄",
    cruciferas: "🥦",
    "granos-leguminosas": "🌽",
});

function normalizeProductName(name) {
    return typeof name === "string"
        ? name
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .trim()
              .toLocaleLowerCase("es-CR")
        : "";
}

/**
 * Exact product → related family → category → generic agricultural fallback.
 * The output is intentionally always a Unicode emoji.
 */
export function getProductEmoji(product) {
    const exactEmoji = exactProductEmojis[normalizeProductName(product?.name)];

    return exactEmoji ?? categoryEmojis[product?.categoryId] ?? "🌱";
}

export function getProductEmojiLabel(product) {
    return `${product?.name ?? "Product"} visual identifier`;
}
