# Marquee: Materials & Brands — Plan & Logo Checklist

Use this list to **plan what goes in the marquee** and to **gather logo/image assets**.  
Once you have each logo or image, add the path in the "Logo path" column and use it in the marquee.

---

## 1. Steel / TMT

| # | Brand name       | Packages where used | Logo path (to add) |
|---|------------------|----------------------|--------------------|
| 1 | Sunvik TMT      | 1849                 | e.g. `/image/brands/sunvik.png` |
| 2 | Kamadhenu       | 1849                 | |
| 3 | SK Turbo        | 2025                 | |
| 4 | JSW             | 2399                 | |
| 5 | INDUS           | 2399                 | |
| 6 | JSW TMT         | 2799                 | |
| 7 | TATA TMT        | 4400                 | |

---

## 2. Cement

| # | Brand name | Packages where used | Logo path (to add) |
|---|------------|----------------------|--------------------|
| 1 | Zuari     | 1849                 | |
| 2 | Bharathi  | 1849                 | |
| 3 | ACC       | 2025, 2399, 2799     | |
| 4 | Dalmia    | 2025, 2399           | |
| 5 | Ultratech | 2399, 2799, 4400     | |
| 6 | Birla     | 2799, 4400           | |

---

## 3. Bath & CP Fittings

| # | Brand name | Packages where used | Logo path (to add) |
|---|------------|----------------------|--------------------|
| 1 | Cera      | 1849                 | |
| 2 | Parryware | 2025                 | |
| 3 | Jaquar    | 2399                 | |
| 4 | Kohler    | 2799                 | |
| 5 | Grohe     | 4400                 | |

---

## 4. Plumbing Pipes & Fittings

| # | Brand name | Packages where used | Logo path (to add) |
|---|------------|----------------------|--------------------|
| 1 | APL Apollo | 1849, 2025           | |
| 2 | Ashirwad  | 2399, 2799, 4400     | |
| 3 | Finolex   | 2399, 2799, 4400     | |
| 4 | Jindal    | 2799, 4400           | |

---

## 5. Overhead / Water Tanks

| # | Brand name | Packages where used | Logo path (to add) |
|---|------------|----------------------|--------------------|
| 1 | Sintex    | 1849, 2025, 2399, 2799 | |

---

## 6. Electrical — Wires

| # | Brand name | Packages where used | Logo path (to add) |
|---|------------|----------------------|--------------------|
| 1 | Orbit     | 1849, 2025           | |
| 2 | Finolex   | 2399, 2799, 4400     | |
| 3 | Havells   | 2399, 2799, 4400     | |
| 4 | Vgard     | 4400                 | |

---

## 7. x

| # | Brand name | Packages where used | Logo path (to add) |
|---|------------|----------------------|--------------------|
| 1 | Anchor    | 1849                 | |
| 2 | Legrand   | 2025, 2799           | |
| 3 | GM        | 2399                 | |
| 4 | Havells   | 2799                 | |
| 5 | Schneider | 4400                 | |
| 6 | Siemens   | 4400                 | |

---

## 8. Painting

| # | Brand name   | Packages where used | Logo path (to add) |
|---|--------------|----------------------|--------------------|
| 1 | Asian Paints | 1849, 2025, 2399, 2799, 4400 | |

---

## 9. Suggested Marquee Content (summary)

**For advertising/promoting**, you can show:

- **Tier 1 (premium / widely recognised):** TATA TMT, JSW, Ultratech, Birla, Kohler, Grohe, Asian Paints, Havells, Legrand, Schneider, Siemens, Finolex, Jaquar, Parryware, Cera.
- **Tier 2 (strong in packages):** ACC, Dalmia, APL Apollo, Ashirwad, Jindal, Sintex, Orbit, Anchor, GM.

**Marquee options:**

1. **Single marquee:** All brands in one row (logo + name).
2. **Two marquees:** One for “Steel & Cement”, one for “Bath, Plumbing & Electrical”.
3. **By package:** e.g. “Brands in our ₹2799 package” with only those logos.

---

## 10. Logo / image specs (recommended)

- **Format:** PNG or SVG (transparent background preferred).
- **Size:** e.g. 160×80 px or 200×100 px (height ~80–100 px).
- **Folder:** e.g. `public/image/brands/` or `public/image/marquee/`.
- **Naming:** `brand-name.png` (e.g. `asian-paints.png`, `tata-tmt.png`).

After you add logo paths above (or in the app config), the marquee can use them; until then, the marquee can show **brand names only** so the section is usable immediately.

---

## 11. Logo paths in the app (white-background marquee)

- **Folder:** `public/image/brands/` — place logo files here.
- **File:** `resources/js/pages/welcome.tsx` — constant `MARQUEE_BRANDS` with logo paths already set.
- **Marquee:** White background, theme styling (brand-primary, #C7A14A hover). If an image fails to load, the first letter of the brand name is shown.

**Expected filenames in `public/image/brands/`:**

| Filename | Brand |
|----------|--------|
| tata-tmt.png | TATA TMT |
| jsw.png | JSW |
| ultratech.png | Ultratech |
| acc.png | ACC |
| birla.png | Birla |
| asian-paints.png | Asian Paints |
| grohe.png | Grohe |
| kohler.png | Kohler |
| jaquar.png | Jaquar |
| parryware.png | Parryware |
| cera.png | Cera |
| havells.png | Havells |
| finolex.png | Finolex |
| legrand.png | Legrand |
| schneider.png | Schneider |
| siemens.png | Siemens |
| apl-apollo.png | APL Apollo |
| ashirwad.png | Ashirwad |
| jindal.png | Jindal |
| sintex.png | Sintex |
