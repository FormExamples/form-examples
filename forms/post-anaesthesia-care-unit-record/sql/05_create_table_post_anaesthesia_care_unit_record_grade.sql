-- Computed PACU grading result. Stores each Modified Aldrete
-- parameter's 0-2 sub-score, the summed Aldrete total (0-10), the
-- derived discharge-readiness band (gated on the oxygen-saturation
-- parameter), and the optional PADSS total and street-fitness result
-- for day-surgery cases.

CREATE TABLE post_anaesthesia_care_unit_record_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    post_anaesthesia_care_unit_record_id UUID NOT NULL UNIQUE
        REFERENCES post_anaesthesia_care_unit_record(id) ON DELETE CASCADE,

    activity_score INT,
    respiration_score INT,
    circulation_score INT,
    consciousness_score INT,
    oxygen_saturation_score INT,
    aldrete_total INT,
    discharge_ready VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (discharge_ready IN ('not-ready', 'discharge-ready', '')),

    padss_total INT,
    padss_street_fit VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (padss_street_fit IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_post_anaesthesia_care_unit_record_grade_updated_at
    BEFORE UPDATE ON post_anaesthesia_care_unit_record_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE post_anaesthesia_care_unit_record_grade IS
    'Computed PACU grading result: per-parameter Aldrete sub-scores, the summed Aldrete total (0-10), the derived discharge-readiness band, and the optional PADSS total and street-fitness result.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.post_anaesthesia_care_unit_record_id IS
    'Foreign key to the parent PACU record (unique, 1:1).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.activity_score IS
    'Aldrete activity sub-score (0-2).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.respiration_score IS
    'Aldrete respiration sub-score (0-2).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.circulation_score IS
    'Aldrete circulation sub-score (0-2).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.consciousness_score IS
    'Aldrete consciousness sub-score (0-2).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.oxygen_saturation_score IS
    'Aldrete oxygen-saturation sub-score (0-2); discharge-readiness is gated on this parameter scoring 2.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.aldrete_total IS
    'Summed Modified Aldrete total across the five parameters (0-10 when complete).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.discharge_ready IS
    'Derived discharge-readiness band: discharge-ready (Aldrete >= 9 and oxygen-saturation score = 2) or not-ready.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.padss_total IS
    'Summed PADSS total (0-10) for ambulatory cases with all five criteria supplied; null otherwise.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.padss_street_fit IS
    'PADSS street-fitness result: yes (PADSS total >= 9), no, or empty when PADSS was not scored.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
