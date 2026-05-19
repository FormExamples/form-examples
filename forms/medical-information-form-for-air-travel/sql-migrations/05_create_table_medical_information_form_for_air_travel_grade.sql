-- Computed grading result for a MEDIF: fitness-to-fly band and submission summary.

CREATE TABLE medical_information_form_for_air_travel_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_information_form_for_air_travel_id UUID NOT NULL UNIQUE
        REFERENCES medical_information_form_for_air_travel(id) ON DELETE CASCADE,

    computed_fitness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (computed_fitness_band IN (
            'fit',
            'fit-with-conditions',
            'requires-review',
            'unfit-to-fly',
            ''
        )),
    final_fitness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (final_fitness_band IN (
            'fit',
            'fit-with-conditions',
            'requires-review',
            'unfit-to-fly',
            ''
        )),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',
    desk_recommendation VARCHAR(500) NOT NULL DEFAULT '',
    physician_notes TEXT NOT NULL DEFAULT '',
    valid_until DATE,
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_medical_information_form_for_air_travel_grade_updated_at
    BEFORE UPDATE ON medical_information_form_for_air_travel_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_information_form_for_air_travel_grade IS
    'Computed and signed-off MEDIF result. Stores both the engine-computed fitness-to-fly band and the physician-final band with an override reason.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.deleted_at IS
    'Timestamp when this row was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.medical_information_form_for_air_travel_id IS
    'Foreign key to the parent MEDIF assessment (unique, 1:1).';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.computed_fitness_band IS
    'Fitness-to-fly band computed by the engine.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.final_fitness_band IS
    'Fitness-to-fly band signed off by the attending physician.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.override_reason IS
    'Reason the physician set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.desk_recommendation IS
    'Recommendation for the airline medical desk (free text).';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.physician_notes IS
    'Free-text physician summary notes.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.valid_until IS
    'Date the MEDIF expires.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.signed_at IS
    'Timestamp of physician electronic signature.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
