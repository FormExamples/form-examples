--liquibase formatted sql

--changeset author:1
-- LPA preferences and instructions — overflow / continuation-sheet text
-- for LP1F section 7 (and sections 3 and 4) when the on-form boxes are
-- not large enough. One row per LPA; the primary section-7 text lives
-- on lasting_power_of_attorney.preferences_text and instructions_text.

CREATE TABLE lpa_preferences_and_instructions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    preferences_overflow_text TEXT NOT NULL DEFAULT '',
    instructions_overflow_text TEXT NOT NULL DEFAULT '',
    decisions_jointly_overflow_text TEXT NOT NULL DEFAULT '',
    replacement_step_in_overflow_text TEXT NOT NULL DEFAULT ''
);
--rollback DROP TABLE lpa_preferences_and_instructions;

--changeset author:2
CREATE TRIGGER trigger_lpa_preferences_and_instructions_updated_at
    BEFORE UPDATE ON lpa_preferences_and_instructions
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_preferences_and_instructions_updated_at ON lpa_preferences_and_instructions;

--changeset author:3
COMMENT ON TABLE lpa_preferences_and_instructions IS
    'LPA preferences and instructions — overflow text for LP1F sections 3, 4, 7 when the donor''s text exceeds the on-form box (continued on LPC sheet 2).';
COMMENT ON COLUMN lpa_preferences_and_instructions.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_preferences_and_instructions.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_preferences_and_instructions.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_preferences_and_instructions.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_preferences_and_instructions.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; UNIQUE so only one overflow row per LPA; cascades on delete.';
COMMENT ON COLUMN lpa_preferences_and_instructions.preferences_overflow_text IS
    'Continuation of LP1F section 7 "preferences" text when the section-7 box overflows.';
COMMENT ON COLUMN lpa_preferences_and_instructions.instructions_overflow_text IS
    'Continuation of LP1F section 7 "instructions" text when the section-7 box overflows.';
COMMENT ON COLUMN lpa_preferences_and_instructions.decisions_jointly_overflow_text IS
    'Continuation of the LP1F section 3 "mixed" decision-mode description when the on-form box overflows.';
COMMENT ON COLUMN lpa_preferences_and_instructions.replacement_step_in_overflow_text IS
    'Continuation of the LP1F section 4 "when and how" replacement-step-in description when the on-form box overflows.';
--rollback SELECT 1;
