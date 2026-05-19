# Static HTML MEDIF dashboard — implementation plan

Static HTML medical-desk dashboard for Medical Information Form for Air
Travel (MEDIF) assessments. Plain HTML + CSS + vanilla JavaScript;
sortable filterable table; baked-in sample dataset; no backend.

## Phases

1. **Scaffold** — `index.html` shell with header, filter bar
   (search, fitness-band, status, flags), and an empty table card.
2. **Stylesheet** — `css/style.css` adapts the visual language from the
   canonical reference (pre-operative-assessment-by-clinician dashboard);
   table, badge palettes, hover states, mobile scroll.
3. **Sample data** — author 8 illustrative rows spanning every fitness
   band and a range of clinical reasons (stable diabetes, late pregnancy,
   recent MI, severe COPD, communicable disease convalescence, etc.).
4. **Sort + filter** — column sort state machine (cycle direction on
   re-click; default desc on date column), search across multiple
   fields, fitness-band and status dropdowns, flags yes / no toggle.
5. **Render** — build table head + body from the column definitions
   and the visible-rows function; show empty-message when filters
   exclude everything.

## Acceptance

- Single dashboard page rendering all sample MEDIF rows.
- Every column is sortable; `aria-sort` reflects the active sort.
- Filter combinations work cumulatively (AND).
- `bin/test-form medical-information-form-for-air-travel` passes.
