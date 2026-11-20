CREATE TABLE pre_operative_assessment_by_clinician.medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    international_nonproprietary_name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medication_updated_at
    BEFORE UPDATE ON pre_operative_assessment_by_clinician.medication
    FOR EACH ROW
    EXECUTE FUNCTION pre_operative_assessment_by_clinician.set_updated_at();

COMMENT ON TABLE pre_operative_assessment_by_clinician.medication IS
    'Medicine';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.medication.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.medication.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.medication.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.medication.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.medication.international_nonproprietary_name IS
    'International Nonproprietary Name (INN) of the medication, as designated by the WHO.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.medication.description IS
    'Description of the medication, including its uses and properties.';

CREATE INDEX medication_index_gto
    ON pre_operative_assessment_by_clinician.medication
    USING GIN ((
        international_nonproprietary_name
            || ' ' ||
        description
    ) gin_trgm_ops);
