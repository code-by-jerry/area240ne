# ✅ COMPLETE SEO CHECKLIST — Area24One Audit
> Last audited: April 2026 | Status: ✔ Done | ❌ Missing | ⚠️ Partial

---

## 🔍 1. BASIC SEO SETUP

### 🌐 Domain & Indexing
- ✔ HTTPS — SSL configured via Laravel, enforced
- ⚠️ www / non-www — not enforced in code (set in server config / Cloudflare)
- ❌ Google Search Console — not connected yet (manual step)
- ❌ Site indexed in Google — not verified (`site:area24one.com`)
- ✔ No noindex on important pages — pages render with `index, follow`
- ❌ Sitemap submitted in GSC — no sitemap exists yet
- ⚠️ robots.txt exists at `/robots.txt` — but missing Sitemap reference line

---

## ⚙️ 2. TECHNICAL SEO

### 🚀 Performance
- ✔ Framer-motion removed from homepage — bundle reduced
- ✔ framer-motion removed from vite manualChunks + optimizeDeps — no longer bundled at all
- ✔ Lazy loading on all images — `loading="lazy" decoding="async"`
- ✔ Section-level `content-visibility: auto` on below-fold sections
- ✔ Backend caching — hero slides (5 min), company profile (10 min)
- ✔ Pexels images — compressed via `?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop` (~60% smaller)
- ✔ ImageKit images — WebP + quality transform applied via `ik()` helper (`f-webp,q-80`)
- ✔ Background section images — WebP at `q-70,w-1400` via ImageKit
- ⚠️ Local public images (PNG/JPEG in `/public/image/`) — not yet converted to WebP
- ⚠️ No srcset / responsive images on local assets

### 📱 Mobile
- ✔ Responsive design — Tailwind mobile-first
- ✔ Viewport meta set correctly in `app.blade.php`
- ✔ Mobile navbar implemented (HomeNavbar component)
- ❌ Mobile usability not verified in GSC yet

### 🔗 URL Structure
- ✔ Clean URLs — `/blogs/{slug}`, `/cost-estimator`, `/chat`
- ✔ Blog slugs are keyword-friendly (set in admin)
- ✔ No query string URLs on public pages
- ❌ No service-specific landing pages (e.g. `/construction-bangalore`)

### 🧭 Crawlability
- ❌ No sitemap.xml — needs to be created
- ✔ robots.txt exists — but needs Sitemap line added
- ✔ All important pages are linked from homepage
- ⚠️ `/chat`, `/cost-estimator` are public but not in sitemap

### 🔒 Security
- ✔ HTTPS / SSL
- ✔ CSRF token in blade layout
- ✔ No mixed content issues (all assets use HTTPS)

### 🧠 Advanced Technical
- ✔ Canonical tags — set per page in WelcomeController, BlogController
- ✔ Schema.org structured data — Organization, WebSite, WebPage, FAQPage on homepage
- ✔ Article schema — blog show page renders via Inertia with SEO props
- ❌ Breadcrumb schema — not implemented
- ❌ Custom 404 page — not found
- ❌ Broken links audit — not done

---

## 📝 3. ON-PAGE SEO

### 🏷️ Meta Tags
- ✔ Unique title per page — homepage, blogs index, blog show all have distinct titles
- ✔ Meta description per page — all controllers pass description
- ✔ Keywords meta — homepage and blog show pass keywords
- ✔ OG tags — og:title, og:description, og:image, og:type all set
- ✔ Twitter card tags — set on homepage
- ⚠️ Blog index page missing Twitter card tags
- ⚠️ Title length — homepage title is 72 chars (should be 50–60)

### 📄 Headings
- ✔ H1 on homepage — "One conversation. Five brands. Zero runaround."
- ✔ H2 hierarchy used across sections
- ⚠️ Blog pages — heading structure depends on content entered in admin
- ❌ No audit tool run on heading order

### 🔑 Content
- ✔ Original content — all copy is custom
- ✔ FAQ section with 6 questions — good for featured snippets
- ✔ Location keywords — Bangalore, Mysore, Ballari, Karnataka mentioned
- ⚠️ Homepage word count is low for SEO (mostly UI, not long-form)
- ❌ No dedicated service pages with 500+ words each

### 🖼️ Image SEO
- ✔ Lazy loading on all images
- ⚠️ ALT text — hero slides use `alt=""` (decorative, acceptable), service card images use service title
- ❌ File names not SEO-friendly — `/image/atha.png` instead of `/image/atha-construction-logo.png`
- ❌ Images not compressed to WebP

### 🔗 Internal Linking
- ✔ Homepage links to `/chat`, `/cost-estimator`, `/blogs`
- ✔ Blog index links to individual blog posts
- ⚠️ No links from blog posts back to service pages
- ❌ No anchor-text-rich internal linking strategy

### 📍 Local SEO
- ✔ Cities mentioned — Bangalore, Mysore, Ballari, Karnataka
- ✔ Phone numbers in company profile
- ❌ Google Business Profile — not linked in code
- ❌ No location-specific landing pages
- ❌ NAP (Name, Address, Phone) not in structured data footer

---

## 📊 4. GOOGLE SEARCH CONSOLE
- ❌ Property not added yet
- ❌ Sitemap not submitted
- ❌ Core Web Vitals not tracked
- ❌ Manual actions status unknown

---

## 📈 5. CONTENT & GROWTH

### 📰 Blogging
- ✔ Blog section exists — `/blogs` with full index + show pages
- ✔ Blog admin — create, edit, publish, feature controls exist
- ✔ SEO fields per blog — seo_title, seo_description, seo_keywords, canonical_url
- ⚠️ No blog posts published yet (or very few)
- ❌ No content calendar / weekly publishing cadence

### 🔍 Keywords
- ⚠️ Homepage targets broad terms — needs tighter keyword focus per section
- ❌ No keyword research document
- ❌ No long-tail keyword targeting per page

### 🔗 Backlinks
- ❌ Google Business Profile not created
- ❌ Not listed in local directories (Justdial, Sulekha, IndiaMART)
- ✔ Social links in company profile (Instagram, Facebook, LinkedIn)

---

## � PRIORITY ACTION LIST

### Do These First (High Impact)
1. ❌ **Create sitemap.xml** — add `spatie/laravel-sitemap` package, auto-generate for `/`, `/blogs`, `/blogs/{slug}`, `/cost-estimator`
2. ❌ **Update robots.txt** — add `Sitemap: https://area24one.com/sitemap.xml`
3. ❌ **Connect Google Search Console** — verify domain, submit sitemap
4. ❌ **Fix homepage title** — shorten from 72 chars to under 60
5. ❌ **Create custom 404 page**

### Do These Next (Medium Impact)
6. ⚠️ **Add breadcrumb schema** — especially on blog show pages
7. ⚠️ **Add Twitter card to blog index**
8. ⚠️ **Create service landing pages** — `/construction-bangalore`, `/interior-design-bangalore` etc.
9. ⚠️ **Add NAP to footer** in structured data
10. ⚠️ **Convert images to WebP** — use Vite plugin or ImageKit transformation params

### Do These Later (Growth)
11. ❌ Google Business Profile
12. ❌ Local directory listings
13. ❌ Publish 2 blog posts/week targeting local + service keywords
14. ❌ Internal linking from blogs → service pages
