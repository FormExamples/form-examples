export type Status = 'pending' | 'decided' | 'approved' | 'superseded' | 'deprecated';

export type Group =
  | ''
  | 'business'
  | 'data'
  | 'integration'
  | 'presentation'
  | 'security'
  | 'infrastructure'
  | 'operations'
  | 'governance'
  | 'other';

export interface AdrRow {
  id: string;
  number: number | null;
  slug: string;
  title: string;
  status: Status;
  decisionGroup: Group;
  decisionDate: string;
  authorName: string;
  markdownUrl: string;
}

export const SAMPLE_ADRS: AdrRow[] = [
  {
    id: '1',
    number: 1,
    slug: 'use-postgres-for-primary-storage',
    title: 'Use PostgreSQL for primary storage',
    status: 'approved',
    decisionGroup: 'data',
    decisionDate: '2026-01-15',
    authorName: 'Lin Chen',
    markdownUrl: 'https://example.com/docs/adr/0001-use-postgres-for-primary-storage.md'
  },
  {
    id: '2',
    number: 2,
    slug: 'adopt-event-sourcing-for-audit',
    title: 'Adopt event sourcing for the audit log',
    status: 'decided',
    decisionGroup: 'data',
    decisionDate: '2026-02-03',
    authorName: 'Marisa Patel',
    markdownUrl: 'https://example.com/docs/adr/0002-adopt-event-sourcing-for-audit.md'
  },
  {
    id: '3',
    number: 3,
    slug: 'oidc-via-keycloak',
    title: 'Authenticate end users via Keycloak (OIDC)',
    status: 'approved',
    decisionGroup: 'security',
    decisionDate: '2026-02-19',
    authorName: 'Tomas Müller',
    markdownUrl: 'https://example.com/docs/adr/0003-oidc-via-keycloak.md'
  },
  {
    id: '4',
    number: 4,
    slug: 'supersede-mongo-for-postgres',
    title: 'Replace MongoDB with PostgreSQL JSONB',
    status: 'superseded',
    decisionGroup: 'data',
    decisionDate: '2025-09-08',
    authorName: 'Lin Chen',
    markdownUrl: 'https://example.com/docs/adr/0004-supersede-mongo-for-postgres.md'
  },
  {
    id: '5',
    number: 5,
    slug: 'tera-templates-for-server-render',
    title: 'Use Tera templates for server-rendered pages',
    status: 'pending',
    decisionGroup: 'presentation',
    decisionDate: '',
    authorName: 'Aiko Tanaka',
    markdownUrl: 'https://example.com/docs/adr/0005-tera-templates-for-server-render.md'
  },
  {
    id: '6',
    number: 6,
    slug: 'deprecate-soap-edi-feed',
    title: 'Deprecate the legacy SOAP/EDI feed',
    status: 'deprecated',
    decisionGroup: 'integration',
    decisionDate: '2024-11-30',
    authorName: 'Marisa Patel',
    markdownUrl: 'https://example.com/docs/adr/0006-deprecate-soap-edi-feed.md'
  }
];
