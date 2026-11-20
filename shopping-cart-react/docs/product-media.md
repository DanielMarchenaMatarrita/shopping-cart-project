# Demo product media verification

Reviewed 2026-11-19. Scope: five fictional demo items only. No photo represents Tropical Fruits & Veggies inventory or endorsement.

| Product | Source and creator | Rights review | Identity and decision |
| --- | --- | --- | --- |
| `DEMO-001` Mango Tommy Atkins | [MangaTommyAtkinsDSC4597.jpg](https://commons.wikimedia.org/wiki/File:MangaTommyAtkinsDSC4597.jpg), CostaPPPR | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/): commercial reuse and adaptations permitted with attribution, license link, change notice, and share-alike | **Approved.** Photo shows mangoes; the photographer identifies Tommy Atkins and notes purchase at a Salvador, Bahia market. Cultivar identification is source-documented, not independently authenticated. |
| `DEMO-002` Piña Golden | [Pineapple and cross section.jpg](https://commons.wikimedia.org/wiki/File:Pineapple_and_cross_section.jpg), Fir0002/Flagstaffotos | CC BY-NC 3.0 is noncommercial; the page lists GFDL 1.2 as its commercial option. Neither option was adopted. | **Candidate rejected; product pending.** The page identifies pineapple, not Golden. No asset acquired. |
| `DEMO-003` Papaya Solo | [Papaya cross section BNC.jpg](https://commons.wikimedia.org/wiki/File:Papaya_cross_section_BNC.jpg), Prathyush Thomas | Page offers GFDL 1.2 only or the Free Art License, with linked license, prominent attribution, and same-license terms for derivatives. Neither option was adopted. | **Candidate not selected; product pending.** The page identifies papaya, not Solo. No asset acquired. |
| `DEMO-004` Tomate | [Tomato je.jpg](https://commons.wikimedia.org/wiki/File:Tomato_je.jpg), Softeis | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) selected from the offered terms: commercial reuse and adaptations permitted under attribution, change notice and share-alike terms | **Approved at product level.** Photographed red tomato fruits and Commons caption identify the product; no cultivar claimed. |
| `DEMO-005` Zanahoria | [Carrots of many colors.jpg](https://commons.wikimedia.org/wiki/File:Carrots_of_many_colors.jpg), Stephen Ausmus; [USDA ARS original record K11611-1](https://www.ars.usda.gov/is/graphics/photos/nov04/K11611-1.htm) | Commons explicitly marks this asset [U.S. public domain (USDA ARS)](https://commons.wikimedia.org/wiki/Template:PD-USGov-USDA-ARS). U.S. copyright does not restrict reuse or resizing; credit retained. Do not infer worldwide status or endorsement from the agency name. | **Approved at product level.** Agency caption and the photo show cultivated carrots in multiple colors; no cultivar claimed. |

## Derivatives and publishing

The original file URLs, author credits, and license links live in `src/data/productMedia.js`. Published JPEGs were resized to a maximum long edge of 720 px and recompressed at quality 76, without cropping or upscaling. Mango and carrot were downloaded using the source pages' own 960 px and 500 px wide renditions; tomato was downloaded from the original. The adapted mango and tomato image files remain under CC BY-SA 4.0 and CC BY-SA 3.0, respectively; this does not change the app's code license.

| Local asset | Dimensions | Bytes |
| --- | --- | ---: |
| `public/images/products/demo-mango.jpg` | 720 × 500 | 49,562 |
| `public/images/products/demo-tomato.jpg` | 720 × 599 | 30,378 |
| `public/images/products/demo-carrot.jpg` | 447 × 720 | 106,319 |

The demo photos share one local URL per item across cards, details, and Quick View. Cards use native lazy loading. The frame reserves a 4:3 area, contains the entire photograph, and falls back to the existing emoji if the request fails. Credits appear next to the photo. No reference item or raw catalog URL bypasses the registry. For future acquisitions, record the candidate, independently verify usage rights and identity, inspect the photo, then add the optimized file and verify the registry and rendered credits.

## Validation

- `pnpm lint` and `pnpm build` passed.
- Node checks confirmed three approved entries and their local files, two pending demo entries, and emoji fallback for all 110 reference entries.
- Headless Chrome decoded all three assets, verified card alt text and lazy-loading attributes, and exercised Quick View, detail credits, an injected image error, search, category filtering, pagination, cart add/badge, and checkout entry. Catalog and detail pages fit at 390 px without horizontal overflow.
- Full simulated checkout confirmation and assistive-technology testing were not rerun in this phase.

## Learning notes

- **Digital Asset Management / Media Registry:** track approved assets and decisions separately from product records. *Gestiona fotos y permisos por ID sin mezclar datos comerciales.*
- **Licensing / Attribution / Provenance:** record who made the photo, where it came from, how it may be used, and what changed. *Una foto visible en Internet no implica permiso de reutilización.*
- **Product Identity Verification:** require evidence at the level claimed; recognizing papaya is not verifying Solo. *La especie y la variedad se verifican por separado.*
- **Fallback Strategy / Lazy Loading / Optimization:** show an emoji when no usable photo exists, defer offscreen requests, and reduce transfer size without enlarging images. *La interfaz sigue funcionando si una imagen falla.*
