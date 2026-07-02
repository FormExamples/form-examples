# LietuvaAsmensKodasView

A headless read-only display for Lithuania's Asmens kodas. Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="lietuva-asmens-kodas-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Lithuania Asmens kodas read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `LietuvaAsmensKodasInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.lietuva-asmens-kodas-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Lithuania
