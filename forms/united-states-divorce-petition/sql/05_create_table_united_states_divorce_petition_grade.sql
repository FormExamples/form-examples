-- Computed readiness classification for a divorce petition: ready-to-file,
-- incomplete, or not-yet-eligible, plus the filing state's property regime
-- and the earliest permitted decree date. Not a score; the court decides.

CREATE TABLE united_states_divorce_petition.united_states_divorce_petition_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_divorce_petition_id UUID NOT NULL UNIQUE
        REFERENCES united_states_divorce_petition.united_states_divorce_petition(id) ON DELETE CASCADE,

    readiness_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (readiness_class IN ('ready-to-file', 'incomplete', 'not-yet-eligible', '')),
    property_regime VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (property_regime IN ('community', 'equitable', 'unknown', '')),
    earliest_decree_date DATE,
    state_rule_known VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (state_rule_known IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_states_divorce_petition_grade_updated_at
    BEFORE UPDATE ON united_states_divorce_petition.united_states_divorce_petition_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_states_divorce_petition.set_updated_at();

COMMENT ON TABLE united_states_divorce_petition.united_states_divorce_petition_grade IS
    'Computed readiness classification for a divorce petition: ready-to-file, incomplete, or not-yet-eligible, the property regime, and the earliest permitted decree date.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.united_states_divorce_petition_id IS
    'Foreign key to the parent petition (unique, 1:1).';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.readiness_class IS
    'Readiness class: ready-to-file, incomplete, or not-yet-eligible (not-yet-eligible takes precedence).';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.property_regime IS
    'Property-division regime of the filing state: community, equitable, or unknown.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.earliest_decree_date IS
    'Earliest date a decree may be entered under the filing state waiting period; null when it cannot be computed.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.state_rule_known IS
    'Whether the filing state is in the engine rule table (yes/no); unknown states use the default rule.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
