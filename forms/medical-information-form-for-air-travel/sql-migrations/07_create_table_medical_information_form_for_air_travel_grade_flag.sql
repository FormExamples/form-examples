-- Safety-critical flags that fire independently of the fitness-to-fly band.

CREATE TABLE medical_information_form_for_air_travel_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_information_form_for_air_travel_grade_id UUID NOT NULL
        REFERENCES medical_information_form_for_air_travel_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'cardiac-acute',
            'pulmonary-acute',
            'gas-expansion',
            'severe-anaemia',
            'severe-hypoxia',
            'late-pregnancy',
            'communicable',
            'high-flow-oxygen',
            'stretcher-required',
            'incubator-required',
            'battery-device',
            'psychiatric',
            'cognitive',
            'pediatric',
            'mobility',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_medical_information_form_for_air_travel_grade_flag_grade_id
    ON medical_information_form_for_air_travel_grade_flag(medical_information_form_for_air_travel_grade_id);

CREATE TRIGGER trigger_medical_information_form_for_air_travel_grade_flag_updated_at
    BEFORE UPDATE ON medical_information_form_for_air_travel_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_information_form_for_air_travel_grade_flag IS
    'Safety-critical flags that fire independently of the fitness-to-fly band, with priority and a suggested action for the airline medical desk.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.deleted_at IS
    'Timestamp when this row was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.medical_information_form_for_air_travel_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-CARDIAC-ACUTE-MI-7D).';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_flag.suggested_action IS
    'Suggested airline-desk action (e.g. "request medical-desk reissue", "arrange dangerous-goods clearance").';
