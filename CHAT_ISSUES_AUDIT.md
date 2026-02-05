# Chat Module — Issues Audit (from user transcript)

## Transcript summary

User said **"events"** → bot showed "Pick a service" then **Construction** confirmation (wrong service).  
User chose **Other** for budget → asked "tell me about you pricings?" → bot showed packages then re-prompted with **"approximate area"** (wrong label; should be "budget range").  
User entered **"yes"** for Timeline (Q3) — not a valid option.  
User entered **"kshsahashd"** (name) and **"xfswfwerfewfw"** (phone) → lead was created with invalid data.

---

## Checklist of issues

### P0 — Critical (wrong service / wrong flow)

| # | Issue | Detail | Status |
|---|--------|--------|--------|
| 1 | **"events" routes to Construction** | User typed "events"; bot showed "Pick a service" then "Great! So you're interested in **Construction**." Expected: Event. Likely cause: intent/matchServiceIntent returns Construction (e.g. tie-break or "events" matching another keyword). | Open |

### P1 — High (wrong label / invalid answers accepted)

| # | Issue | Detail | Status |
|---|--------|--------|--------|
| 2 | **Wrong re-prompt label after package answer** | After "tell me about you pricings?" (Construction Q2 – budget), bot said "please specify your **approximate area**". Should say "**budget range**". getCustomInputLabel was made service-aware; confirm deploy and that this path uses it. | Verify |
| 3 | **Q3 accepts non-option answers** | User typed "yes" for "Timeline for groundbreaking?" (options: 0–3 months, 3–6 months, etc.). Bot accepted and moved to location. Should validate: if answer is not one of the options and not "Other", re-prompt "Please pick one of the options" or list them again. | Open |
| 4 | **No phone validation** | Phone "xfswfwerfewfw" was accepted. Should validate: digits (and optional +91), length 10 (India) or similar; reject and re-ask with a clear message. | Open |
| 5 | **No name validation** | Name "kshsahashd" was accepted. Optional: min length, or basic "looks invalid" (e.g. at least 2 chars, or 2 words) and re-ask. | Open |

### P2 — Medium (UX / robustness)

| # | Issue | Detail | Status |
|---|--------|--------|--------|
| 6 | **Lead created with invalid data** | Lead was saved with gibberish name and phone. Should block lead creation until name/phone pass validation and show inline error. | Open |
| 7 | **Optional: validate custom budget format** | User entered "₹1849/sqft x 1400" as custom budget — accepted. Optionally validate or normalise (e.g. extract package + area) or leave as free text. | Optional |

---

## Recommended fix order

1. **P0:** Fix "events" → Event (add "events" to Event keywords; ensure Event wins over Construction when input contains "event"/"events").
2. **P1:** Confirm re-prompt label uses getCustomInputLabel(service) so Construction Q2 shows "budget range".
3. **P1:** In LEAD_QUALIFICATION, for q1/q2/q3: if answer is not in LEAD_QUESTION_OPTIONS and not "Other", re-prompt with "Please pick one of the options below" and re-send options.
4. **P1:** Add phone validation (digits, length 10 or 12 with country code); on failure re-ask with "Please enter a valid 10-digit phone number."
5. **P1:** Add minimal name validation (e.g. length ≥ 2); optionally require 2+ chars and re-ask.
6. **P2:** Before creating lead, run name/phone validation again; if invalid return error message and do not create lead.

---

## Files to change

| Issue | File | Change |
|-------|------|--------|
| 1 | ChatService.php | matchServiceIntent: add "events" to Event; when input is "events" or "event", prefer Event over others (e.g. explicit check or tie-break). |
| 2 | ChatService.php | Confirm getCustomInputLabel($customQ, $service) is used in the "when waiting for custom + package question" block (already done; verify). |
| 3 | ChatService.php | LEAD_QUALIFICATION: for q1/q2/q3, if `!$waitingForCustomInput` and answer not in options and not "Other", return re-prompt with options. |
| 4–6 | ChatService.php | Add validatePhone(), validateName(); in name/phone steps validate and re-ask on failure; before Lead::create() validate again and abort on failure. |

---

## Notes

- **Re-prompt label:** Code now has service-aware `getCustomInputLabel` (Construction q2 → "budget range"). If the transcript was from before that change, no code change; otherwise ensure the package-question re-prompt path uses it.
- **"events" → Construction:** Possible causes: (a) "events" not in Event keywords (only "event"), and a tie or wrong service chosen; (b) INIT vs INTENT_DETECTION: first message might be empty and second "events" — check which state and message is used for intent. Fix: add "events" to Event keywords; consider explicit branch for input "events" or "event" to force Event.
