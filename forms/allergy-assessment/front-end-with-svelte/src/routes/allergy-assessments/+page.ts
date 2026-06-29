// The clinician dashboard renders the SVAR DataGrid, which is a client-only
// component (its packages are not SSR-safe), so this route is client-only.
export const ssr = false;
