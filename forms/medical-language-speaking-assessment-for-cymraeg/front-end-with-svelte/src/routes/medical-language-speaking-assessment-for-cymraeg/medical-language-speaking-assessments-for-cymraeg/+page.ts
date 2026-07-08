// The exam-admin dashboard renders the SVAR DataGrid, which is a client-only
// component (its packages reference browser DOM APIs and are not SSR-safe), so
// this route is rendered on the client only.
export const ssr = false;
