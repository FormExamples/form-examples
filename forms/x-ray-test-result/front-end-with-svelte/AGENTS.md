# X-Ray Test Result — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the plain-radiograph (X-ray)
result (report), with the seven report sections and the four-axis interpretation
grade. Lily Design System Svelte conventions; rule IDs match the back-end. See
the form root [`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).

## Specification Driven Development

**The `spec/` directory is the source of truth.** 
- Before doing anything read all files inside the `spec/` directory using your file-reading tools.
- Treat all files inside `spec/` as strict requirements. Where any file disagrees with the spec, the spec wins: fix the file, or change the spec on purpose and bring the other files into line in the same commit. 
- Do not improvise structure, style, or citation practice.
