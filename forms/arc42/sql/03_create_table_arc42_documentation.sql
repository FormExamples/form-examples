-- A snapshot of an arc42 architecture documentation. Prose fields live here;
-- list elements (stakeholders, ADRs, risks, etc.) are FK-referenced from
-- their dedicated tables.

CREATE TABLE arc42_documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    architecture_id UUID NOT NULL REFERENCES architecture(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL DEFAULT '',
    author_role TEXT NOT NULL DEFAULT '',
    document_date DATE,

    -- §1 Introduction & Goals
    introduction TEXT NOT NULL DEFAULT '',

    -- §3 Context & Scope
    business_context_description TEXT NOT NULL DEFAULT '',
    technical_context_description TEXT NOT NULL DEFAULT '',

    -- §4 Solution Strategy
    solution_strategy_summary TEXT NOT NULL DEFAULT '',
    top_level_decomposition_summary TEXT NOT NULL DEFAULT '',

    -- §5 Building Block View
    building_block_overview TEXT NOT NULL DEFAULT '',

    -- §6 Runtime View
    runtime_overview TEXT NOT NULL DEFAULT '',

    -- §7 Deployment View
    deployment_overview TEXT NOT NULL DEFAULT '',

    -- §8 Crosscutting Concepts
    crosscutting_overview TEXT NOT NULL DEFAULT '',

    -- §10 Quality Requirements
    quality_tree_summary TEXT NOT NULL DEFAULT '',

    -- §12 Sign-off
    recommendation TEXT NOT NULL DEFAULT '' CHECK (recommendation IN ('proceed', 'revise-first', 'block', '')),
    additional_notes TEXT NOT NULL DEFAULT '',
    signed_by TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_arc42_documentation_updated_at
    BEFORE UPDATE ON arc42_documentation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE arc42_documentation IS 'Snapshot of arc42 architecture documentation (prose fields and metadata).';
COMMENT ON COLUMN arc42_documentation.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN arc42_documentation.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN arc42_documentation.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN arc42_documentation.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN arc42_documentation.architecture_id IS 'Parent architecture (cascade-deleted).';
COMMENT ON COLUMN arc42_documentation.author_name IS 'Name of the person who authored this documentation snapshot.';
COMMENT ON COLUMN arc42_documentation.author_role IS 'Role of the author (e.g. Lead Architect, Tech Lead).';
COMMENT ON COLUMN arc42_documentation.document_date IS 'Date this documentation snapshot was produced.';
COMMENT ON COLUMN arc42_documentation.introduction IS '§1 Introduction & Goals — free-text introduction to the architecture.';
COMMENT ON COLUMN arc42_documentation.business_context_description IS '§3 Context & Scope — prose description of the business context and external business partners.';
COMMENT ON COLUMN arc42_documentation.technical_context_description IS '§3 Context & Scope — prose description of the technical context and external interfaces.';
COMMENT ON COLUMN arc42_documentation.solution_strategy_summary IS '§4 Solution Strategy — summary of the key solution strategy decisions.';
COMMENT ON COLUMN arc42_documentation.top_level_decomposition_summary IS '§4 Solution Strategy — prose summary of the top-level system decomposition approach.';
COMMENT ON COLUMN arc42_documentation.building_block_overview IS '§5 Building Block View — prose overview of the top-level building block structure.';
COMMENT ON COLUMN arc42_documentation.runtime_overview IS '§6 Runtime View — prose overview of the key runtime scenarios.';
COMMENT ON COLUMN arc42_documentation.deployment_overview IS '§7 Deployment View — prose overview of the deployment environment and topology.';
COMMENT ON COLUMN arc42_documentation.crosscutting_overview IS '§8 Crosscutting Concepts — prose overview of shared architectural patterns and constraints.';
COMMENT ON COLUMN arc42_documentation.quality_tree_summary IS '§10 Quality Requirements — prose summary of the quality attribute tree.';
COMMENT ON COLUMN arc42_documentation.recommendation IS '§12 Sign-off — author recommendation: proceed, revise-first, or block.';
COMMENT ON COLUMN arc42_documentation.additional_notes IS '§12 Sign-off — free-text additional notes from the author.';
COMMENT ON COLUMN arc42_documentation.signed_by IS '§12 Sign-off — name of the person who signed off the documentation.';
COMMENT ON COLUMN arc42_documentation.signed_at IS '§12 Sign-off — timestamp when the documentation was signed off.';

CREATE INDEX arc42_documentation_index_gto
    ON arc42_documentation
    USING GIN ((introduction) gin_trgm_ops);
