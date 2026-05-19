# Plan: WHO Surgical Safety Checklist — HTML dashboard

- [x] Static table with sortable columns (case date, patient, site, theatre,
      surgeon, anaesthetist, urgency, specialty, status, flag count).
- [x] Dropdown filters (status, urgency, specialty, flag presence) and
      free-text search.
- [x] Detail modal showing all three phases plus the operating-team roster.
- [x] Sample data covering elective / emergency, completed / abandoned, with
      and without safety flags.
- [x] Graceful fall-back to sample data when the Loco backend is offline.
- [ ] CSV / TSV / JSON export (future).
- [ ] Live API pagination + server-side filtering (future).
