-- Main architecture decision record table.
-- Captures the 14 sections of the Tyree & Akerman ADR template
-- (Tyree, J. and Akerman, A., "Architecture Decisions: Demystifying
-- Architecture", IEEE Software, March/April 2005).
--
-- Sections held directly on this row as text:
--   issue, decision, assumptions, constraints, argument, implications,
--   related_decisions, related_requirements, related_artifacts,
--   related_principles
--
-- Sections held on child tables:
--   positions  -> architecture_decision_record_position
--   notes      -> architecture_decision_record_note

CREATE TABLE architecture_decision_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    author_id UUID REFERENCES author(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organization(id) ON DELETE SET NULL,

    -- Identification
    slug TEXT NOT NULL DEFAULT '',
    number INTEGER,
    title TEXT NOT NULL,
    decision_date DATE,

    -- Tyree & Akerman section 3: Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'decided',
        'approved',
        'superseded',
        'deprecated',
        ''
    )),

    -- Tyree & Akerman section 4: Group
    decision_group TEXT NOT NULL DEFAULT '' CHECK (decision_group IN (
        'business',
        'data',
        'integration',
        'presentation',
        'security',
        'infrastructure',
        'operations',
        'governance',
        'other',
        ''
    )),

    -- Tyree & Akerman section 1: Issue
    issue TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 2: Decision
    decision TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 5: Assumptions
    assumptions TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 6: Constraints
    constraints TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 8: Argument (rationale)
    argument TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 9: Implications
    implications TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 10: Related Decisions
    related_decisions TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 11: Related Requirements
    related_requirements TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 12: Related Artifacts
    related_artifacts TEXT NOT NULL DEFAULT '',

    -- Tyree & Akerman section 13: Related Principles
    related_principles TEXT NOT NULL DEFAULT '',

    -- Sign-off
    signed_off_by TEXT NOT NULL DEFAULT '',
    signed_off_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_architecture_decision_record_updated_at
    BEFORE UPDATE ON architecture_decision_record
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE architecture_decision_record IS
    'Architecture decision record (Tyree & Akerman 14-section template).';
COMMENT ON COLUMN architecture_decision_record.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN architecture_decision_record.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN architecture_decision_record.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN architecture_decision_record.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN architecture_decision_record.author_id IS
    'Foreign key to author.id; the architect or decision-maker.';
COMMENT ON COLUMN architecture_decision_record.organization_id IS
    'Foreign key to organization.id; the org context.';
COMMENT ON COLUMN architecture_decision_record.slug IS
    'URL-safe identifier such as "use-postgres-for-primary-storage".';
COMMENT ON COLUMN architecture_decision_record.number IS
    'Sequential ADR number, e.g. 0042; optional, may be assigned post-merge.';
COMMENT ON COLUMN architecture_decision_record.title IS
    'Short human-readable title summarising the decision.';
COMMENT ON COLUMN architecture_decision_record.decision_date IS
    'Date on which the decision was made (status transitions to decided/approved).';
COMMENT ON COLUMN architecture_decision_record.status IS
    'Status: pending, decided, approved, superseded, deprecated.';
COMMENT ON COLUMN architecture_decision_record.decision_group IS
    'Tyree & Akerman section 4: organising group such as data, integration, security.';
COMMENT ON COLUMN architecture_decision_record.issue IS
    'Tyree & Akerman section 1: the architectural design issue being addressed.';
COMMENT ON COLUMN architecture_decision_record.decision IS
    'Tyree & Akerman section 2: the position chosen, stated clearly.';
COMMENT ON COLUMN architecture_decision_record.assumptions IS
    'Tyree & Akerman section 5: environmental factors influencing the decision.';
COMMENT ON COLUMN architecture_decision_record.constraints IS
    'Tyree & Akerman section 6: environmental limits imposed by the decision.';
COMMENT ON COLUMN architecture_decision_record.argument IS
    'Tyree & Akerman section 8: rationale for the chosen position.';
COMMENT ON COLUMN architecture_decision_record.implications IS
    'Tyree & Akerman section 9: consequences, follow-on decisions, scope/schedule impact.';
COMMENT ON COLUMN architecture_decision_record.related_decisions IS
    'Tyree & Akerman section 10: other ADRs this one depends on or supersedes.';
COMMENT ON COLUMN architecture_decision_record.related_requirements IS
    'Tyree & Akerman section 11: business or functional requirements addressed.';
COMMENT ON COLUMN architecture_decision_record.related_artifacts IS
    'Tyree & Akerman section 12: designs, models, scope documents impacted.';
COMMENT ON COLUMN architecture_decision_record.related_principles IS
    'Tyree & Akerman section 13: enterprise principles this aligns with or breaks.';
COMMENT ON COLUMN architecture_decision_record.signed_off_by IS
    'Name of the person who signed off the decision.';
COMMENT ON COLUMN architecture_decision_record.signed_off_at IS
    'Timestamp when the decision was signed off.';

CREATE INDEX architecture_decision_record_author_id_index
    ON architecture_decision_record(author_id);

CREATE INDEX architecture_decision_record_organization_id_index
    ON architecture_decision_record(organization_id);

CREATE INDEX architecture_decision_record_status_index
    ON architecture_decision_record(status);

CREATE UNIQUE INDEX architecture_decision_record_slug_unique_index
    ON architecture_decision_record(slug)
    WHERE slug <> '' AND deleted_at IS NULL;

CREATE INDEX architecture_decision_record_title_index_gin_trgm
    ON architecture_decision_record
    USING GIN ((title) gin_trgm_ops);
