-- Computed completeness and eligibility result for a vehicle title and
-- registration application. The engine classifies the application as
-- ready-to-submit, incomplete, or title-brand-or-lien-issue, and records the VIN
-- status, whether an odometer disclosure is required, and how many items are
-- outstanding. This is a classification, not a numeric score, and it does not
-- replace the issuing state agency's decision.

CREATE TABLE vehicle_title_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    vehicle_title_application_id UUID NOT NULL UNIQUE REFERENCES vehicle_title_application(id) ON DELETE CASCADE,
    application_class VARCHAR(25) NOT NULL DEFAULT '' CHECK (application_class IN ('ready-to-submit', 'incomplete', 'title-brand-or-lien-issue', '')),
    vin_status VARCHAR(22) NOT NULL DEFAULT '' CHECK (vin_status IN ('valid', 'not-standardized', 'invalid-length', 'invalid-characters', 'check-digit-mismatch', '')),
    odometer_disclosure_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (odometer_disclosure_required IN ('yes', 'no', '')),
    brand_or_lien_issue VARCHAR(5) NOT NULL DEFAULT '' CHECK (brand_or_lien_issue IN ('yes', 'no', '')),
    outstanding_item_count INTEGER NOT NULL DEFAULT 0 CHECK (outstanding_item_count >= 0),
    state_rule_known VARCHAR(5) NOT NULL DEFAULT '' CHECK (state_rule_known IN ('yes', 'no', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX vehicle_title_application_grade_class_idx
    ON vehicle_title_application_grade (application_class);

CREATE TRIGGER trigger_vehicle_title_application_grade_updated_at
    BEFORE UPDATE ON vehicle_title_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE vehicle_title_application_grade IS
    'Computed completeness and eligibility result for a vehicle title and registration application: application class, VIN status, odometer-disclosure requirement, brand-or-lien issue, and outstanding-item count.';
COMMENT ON COLUMN vehicle_title_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN vehicle_title_application_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN vehicle_title_application_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN vehicle_title_application_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN vehicle_title_application_grade.vehicle_title_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN vehicle_title_application_grade.application_class IS
    'Application class: ready-to-submit, incomplete, or title-brand-or-lien-issue (the issue class takes precedence).';
COMMENT ON COLUMN vehicle_title_application_grade.vin_status IS
    'VIN validity per 49 CFR 565.15: valid, not-standardized (pre-1981), invalid-length, invalid-characters, or check-digit-mismatch; empty when no VIN.';
COMMENT ON COLUMN vehicle_title_application_grade.odometer_disclosure_required IS
    'Whether a federal odometer disclosure is required (no when exempt under 49 CFR 580.17).';
COMMENT ON COLUMN vehicle_title_application_grade.brand_or_lien_issue IS
    'Whether a title brand, NMVTIS alert, unreleased lien, or not-actual odometer disclosure is present.';
COMMENT ON COLUMN vehicle_title_application_grade.outstanding_item_count IS
    'Number of items still missing before the application can be submitted.';
COMMENT ON COLUMN vehicle_title_application_grade.state_rule_known IS
    'Whether the state is in the encoded rule table (no means the uniform default applied).';
COMMENT ON COLUMN vehicle_title_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
