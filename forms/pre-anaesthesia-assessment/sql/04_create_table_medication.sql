CREATE TABLE pre_anaesthesia_assessment.medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    international_nonproprietary_name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medication_updated_at
    BEFORE UPDATE ON pre_anaesthesia_assessment.medication
    FOR EACH ROW
    EXECUTE FUNCTION pre_anaesthesia_assessment.set_updated_at();

COMMENT ON TABLE pre_anaesthesia_assessment.medication IS
    'Medicine';
COMMENT ON COLUMN pre_anaesthesia_assessment.medication.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_anaesthesia_assessment.medication.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_anaesthesia_assessment.medication.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_anaesthesia_assessment.medication.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.medication.international_nonproprietary_name IS
    'International Nonproprietary Name (INN) of the medication, as designated by the WHO.';
COMMENT ON COLUMN pre_anaesthesia_assessment.medication.description IS
    'Description of the medication, including its uses and properties.';

CREATE INDEX medication_index_gto
    ON pre_anaesthesia_assessment.medication
    USING GIN ((
        international_nonproprietary_name
            || ' ' ||
        description
    ) gin_trgm_ops);
