/*
 * Sample register data for development.
 *
 * In production, replace this file with one generated from the database
 * (a JOIN of architecture_decision_record + author + organization).
 *
 * Schema: array of objects, one per ADR. The dashboard renders these directly.
 */
window.ARCHITECTURE_DECISION_RECORDS = [
  {
    slug: 'use-postgres-for-primary-storage',
    number: 1,
    title: 'Use PostgreSQL for primary storage',
    status: 'approved',
    decisionGroup: 'data',
    decisionDate: '2026-01-15',
    authorName: 'Lin Chen',
    markdownUrl: 'https://example.com/docs/adr/0001-use-postgres-for-primary-storage.md'
  },
  {
    slug: 'adopt-event-sourcing-for-audit',
    number: 2,
    title: 'Adopt event sourcing for the audit log',
    status: 'decided',
    decisionGroup: 'data',
    decisionDate: '2026-02-03',
    authorName: 'Marisa Patel',
    markdownUrl: 'https://example.com/docs/adr/0002-adopt-event-sourcing-for-audit.md'
  },
  {
    slug: 'oidc-via-keycloak',
    number: 3,
    title: 'Authenticate end users via Keycloak (OIDC)',
    status: 'approved',
    decisionGroup: 'security',
    decisionDate: '2026-02-19',
    authorName: 'Tomas Müller',
    markdownUrl: 'https://example.com/docs/adr/0003-oidc-via-keycloak.md'
  },
  {
    slug: 'supersede-mongo-for-postgres',
    number: 4,
    title: 'Replace MongoDB with PostgreSQL JSONB',
    status: 'superseded',
    decisionGroup: 'data',
    decisionDate: '2025-09-08',
    authorName: 'Lin Chen',
    markdownUrl: 'https://example.com/docs/adr/0004-supersede-mongo-for-postgres.md'
  },
  {
    slug: 'tera-templates-for-server-render',
    number: 5,
    title: 'Use Tera templates for server-rendered pages',
    status: 'pending',
    decisionGroup: 'presentation',
    decisionDate: '',
    authorName: 'Aiko Tanaka',
    markdownUrl: 'https://example.com/docs/adr/0005-tera-templates-for-server-render.md'
  },
  {
    slug: 'deprecate-soap-edi-feed',
    number: 6,
    title: 'Deprecate the legacy SOAP/EDI feed',
    status: 'deprecated',
    decisionGroup: 'integration',
    decisionDate: '2024-11-30',
    authorName: 'Marisa Patel',
    markdownUrl: 'https://example.com/docs/adr/0006-deprecate-soap-edi-feed.md'
  }
];
