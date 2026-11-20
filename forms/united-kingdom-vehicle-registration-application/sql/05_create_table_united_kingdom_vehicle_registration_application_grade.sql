-- Computed completeness and validity classification for a vehicle
-- registration application: ready to submit, incomplete, or needing
-- supporting documents, with the fee the DVLA requires. This is a validity
-- check, not a decision; the DVLA decides every application.

CREATE TABLE united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    -- Parent
    united_kingdom_vehicle_registration_application_id UUID NOT NULL UNIQUE
        REFERENCES united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application(id) ON DELETE CASCADE,
    validity_class VARCHAR(30) NOT NULL DEFAULT '' CHECK (validity_class IN ('ready-to-submit', 'incomplete', 'needs-supporting-documents', '')),
    fee_due_as_pence INTEGER,
    missing_item_count INTEGER NOT NULL DEFAULT 0,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_vehicle_registration_application_grade_updated_at
    BEFORE UPDATE ON united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_vehicle_registration_application.set_updated_at();

COMMENT ON TABLE united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade IS
    'Computed completeness and validity classification for a vehicle registration application (ready-to-submit, incomplete, needs-supporting-documents), the fee due, and the count of missing items.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.united_kingdom_vehicle_registration_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.validity_class IS
    'Validity classification: ready-to-submit, incomplete, or needs-supporting-documents (incomplete takes precedence).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.fee_due_as_pence IS
    'Fee the DVLA requires for this application, in pence.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.missing_item_count IS
    'Number of missing data items and documents found.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.united_kingdom_vehicle_registration_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
