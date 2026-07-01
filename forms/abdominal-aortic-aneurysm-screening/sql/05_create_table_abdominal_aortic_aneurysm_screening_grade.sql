-- Computed diameter classification for an abdominal-aortic-aneurysm-screening
-- record. The engine classifies the aorta by the maximum antero-posterior
-- diameter (with a non-visualisation guard) into a category, sets the
-- surveillance/referral band and the recommended action, and records the
-- interval growth. This is a result-classification outcome, not a numeric score.

CREATE TABLE abdominal_aortic_aneurysm_screening_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    abdominal_aortic_aneurysm_screening_id UUID NOT NULL UNIQUE
        REFERENCES abdominal_aortic_aneurysm_screening(id) ON DELETE CASCADE,

    category VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (category IN (
            'normal',
            'small',
            'medium',
            'large',
            'non-visualised',
            ''
        )),
    surveillance_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (surveillance_band IN (
            'discharge',
            'annual',
            'three-monthly',
            'refer-vascular',
            'rescan',
            ''
        )),
    recommended_action TEXT NOT NULL DEFAULT '',
    growth_cm NUMERIC(4,1),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_abdominal_aortic_aneurysm_screening_grade_updated_at
    BEFORE UPDATE ON abdominal_aortic_aneurysm_screening_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE abdominal_aortic_aneurysm_screening_grade IS
    'Computed diameter classification for an abdominal-aortic-aneurysm-screening record: category, surveillance/referral band, recommended action, and interval growth.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.abdominal_aortic_aneurysm_screening_id IS
    'Foreign key to the parent abdominal-aortic-aneurysm-screening record (unique, 1:1).';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.category IS
    'Diameter category: normal (< 3.0 cm), small (3.0-4.4 cm), medium (4.5-5.4 cm), large (>= 5.5 cm), or non-visualised.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.surveillance_band IS
    'Surveillance/referral band: discharge, annual, three-monthly, refer-vascular, or rescan.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.recommended_action IS
    'Human-readable recommended action derived from the category.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.growth_cm IS
    'Interval growth in centimetres (current minus prior diameter) when both are present; null otherwise.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
