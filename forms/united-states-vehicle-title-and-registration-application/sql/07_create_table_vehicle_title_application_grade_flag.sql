-- Flagged issues that fire independently of the application class, with a
-- priority and a suggested action for the applicant or the agency clerk.

CREATE TABLE vehicle_title_application_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    vehicle_title_application_grade_id UUID NOT NULL REFERENCES vehicle_title_application_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(12) NOT NULL DEFAULT '' CHECK (category IN ('state', 'vin', 'odometer', 'brand', 'lien', 'title', 'owner', 'insurance', 'inspection', 'tax', 'fees', 'deadline', 'date', 'weight', 'vehicle', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX vehicle_title_application_grade_flag_grade_id_idx
    ON vehicle_title_application_grade_flag (vehicle_title_application_grade_id);

CREATE TRIGGER trigger_vehicle_title_application_grade_flag_updated_at
    BEFORE UPDATE ON vehicle_title_application_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE vehicle_title_application_grade_flag IS
    'Flagged issues that fire independently of the application class, with priority and a suggested action for the applicant or clerk.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.vehicle_title_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-VIN-002).';
COMMENT ON COLUMN vehicle_title_application_grade_flag.category IS
    'Flag category: state, vin, odometer, brand, lien, title, owner, insurance, inspection, tax, fees, deadline, date, weight, vehicle, other.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN vehicle_title_application_grade_flag.suggested_action IS
    'Suggested action for the applicant or clerk (e.g. "obtain a signed lien release before submitting").';
