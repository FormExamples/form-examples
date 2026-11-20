-- One person on the occupant roster of a Council Tax discount application,
-- other than the applicant, with their status and whether evidence is held.

CREATE TABLE occupant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_council_tax_discount_application_id UUID NOT NULL REFERENCES united_kingdom_council_tax_discount_application(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT '' CHECK (status IN ('counted-adult', 'full-time-student', 'severely-mentally-impaired', 'under-18', 'apprentice', 'education-18-19', 'live-in-carer', 'care-leaver', 'other-disregarded', '')),
    evidence_held VARCHAR(5) NOT NULL DEFAULT '' CHECK (evidence_held IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_occupant_updated_at
    BEFORE UPDATE ON occupant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE occupant IS
    'One person on the occupant roster of a Council Tax discount application, other than the applicant, with their status and whether evidence is held.';
COMMENT ON COLUMN occupant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN occupant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN occupant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN occupant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN occupant.united_kingdom_council_tax_discount_application_id IS
    'Foreign key to the parent application.';
COMMENT ON COLUMN occupant.name IS
    'Full name of the occupant.';
COMMENT ON COLUMN occupant.birth_date IS
    'Date of birth of the occupant.';
COMMENT ON COLUMN occupant.status IS
    'Status of the occupant: counted-adult or a disregarded status.';
COMMENT ON COLUMN occupant.evidence_held IS
    'Whether evidence of the occupant''s status is held (yes/no).';

CREATE INDEX occupant_ukctda_id_idx
    ON occupant (united_kingdom_council_tax_discount_application_id);
