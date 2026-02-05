# Enhancement Plan for `welcome.tsx`

## Objective
Enhance the UI/UX of the landing page to fully align with the Area24One brand identity ("Intelligence Navy", Premium, Clean) and fix visibility issues in dark mode.

## Proposed Changes

1.  **Hero Section Typography & Contrast**
    *   **Current**: `text-brand-primary` on H1 makes it invisible in dark mode (Navy text on Navy background).
    *   **Fix**: Update to `text-brand-primary dark:text-white`.
    *   **Enhancement**: Use a subtle gradient for the headline to feel more "premium".

2.  **Discovery Input Fields (Selects)**
    *   **Current**: Standard Tailwind form styles with `ring-indigo-600`.
    *   **Fix**: Change focus ring to `ring-brand-primary dark:ring-white`.
    *   **Enhancement**: Add `dark:bg-zinc-900 dark:border-zinc-700 dark:text-white` to ensure they look good in dark mode.

3.  **Service Cards (Expertise)**
    *   **Current**: `hover:bg-zinc-50`.
    *   **Enhancement**: Add a "Champagne Gold" (#C7A14A) accent on hover for the icons or "Consult Now" text to align with the "micro-use accent" policy.
    *   **Glassmorphism**: Ensure dark mode cards have a slight transparency/blur.

4.  **"Why Us" Bento Grid**
    *   **Enhancement**: Refine the card shadows and border colors to be `brand-border` (`#CBD5E1`) instead of generic gray.

5.  **General Polish**
    *   Ensure all buttons use the `brand-primary` color and accessible text colors.

## Verification
*   Check dark mode visibility for all text.
*   Verify hover states are responsive and visible.
