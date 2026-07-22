-- Computed scores for one patient_reported_outcome_measures row (1:1).
-- Values here are always re-derivable from the raw responses via the
-- exact algorithms in ../spec/index.md; stored for fast reporting/query
-- rather than recomputed on every read.

CREATE TABLE patient_reported_outcome_measures_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_reported_outcome_measures_id UUID NOT NULL UNIQUE REFERENCES patient_reported_outcome_measures(id) ON DELETE CASCADE,

    -- SF-36 (RAND-36 method): 8 domains 0-100 + simplified summary scores
    sf36_pf NUMERIC CHECK (sf36_pf IS NULL OR sf36_pf BETWEEN 0 AND 100),
    sf36_rp NUMERIC CHECK (sf36_rp IS NULL OR sf36_rp BETWEEN 0 AND 100),
    sf36_bp NUMERIC CHECK (sf36_bp IS NULL OR sf36_bp BETWEEN 0 AND 100),
    sf36_gh NUMERIC CHECK (sf36_gh IS NULL OR sf36_gh BETWEEN 0 AND 100),
    sf36_vt NUMERIC CHECK (sf36_vt IS NULL OR sf36_vt BETWEEN 0 AND 100),
    sf36_sf NUMERIC CHECK (sf36_sf IS NULL OR sf36_sf BETWEEN 0 AND 100),
    sf36_re NUMERIC CHECK (sf36_re IS NULL OR sf36_re BETWEEN 0 AND 100),
    sf36_mh NUMERIC CHECK (sf36_mh IS NULL OR sf36_mh BETWEEN 0 AND 100),
    sf36_pcs_approx NUMERIC CHECK (sf36_pcs_approx IS NULL OR sf36_pcs_approx BETWEEN 0 AND 100),
    sf36_mcs_approx NUMERIC CHECK (sf36_mcs_approx IS NULL OR sf36_mcs_approx BETWEEN 0 AND 100),

    -- Neck Disability Index
    ndi_raw_score SMALLINT CHECK (ndi_raw_score IS NULL OR ndi_raw_score BETWEEN 0 AND 50),
    ndi_answered_sections SMALLINT CHECK (ndi_answered_sections IS NULL OR ndi_answered_sections BETWEEN 0 AND 10),
    ndi_percentage_score NUMERIC CHECK (ndi_percentage_score IS NULL OR ndi_percentage_score BETWEEN 0 AND 100),
    ndi_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (ndi_band IN ('no-disability', 'mild', 'moderate', 'severe', 'complete', '')),

    -- modified Japanese Orthopedic Association
    mjoa_total_score SMALLINT CHECK (mjoa_total_score IS NULL OR mjoa_total_score BETWEEN 0 AND 17),
    mjoa_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (mjoa_band IN ('mild', 'moderate', 'severe', '')),

    -- EQ-5D-3L
    eq5d_health_state_descriptor VARCHAR(5) NOT NULL DEFAULT '',
    eq5d_uk_index_value NUMERIC CHECK (eq5d_uk_index_value IS NULL OR eq5d_uk_index_value BETWEEN -1 AND 1),
    eq5d_vas_score NUMERIC CHECK (eq5d_vas_score IS NULL OR eq5d_vas_score BETWEEN 0 AND 100)
);

CREATE TRIGGER trigger_patient_reported_outcome_measures_score_updated_at
    BEFORE UPDATE ON patient_reported_outcome_measures_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient_reported_outcome_measures_score IS
    'Computed scores (1:1) for a patient_reported_outcome_measures row; always re-derivable from raw responses via the exact algorithms in spec/index.md.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.patient_reported_outcome_measures_id IS
    'Foreign key to the parent raw-response row (1:1).';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_pf IS
    'SF-36 Physical Functioning domain score, 0-100 (RAND-36 method), higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_rp IS
    'SF-36 Role-Physical domain score, 0-100, higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_bp IS
    'SF-36 Bodily Pain domain score, 0-100, higher = better (less pain).';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_gh IS
    'SF-36 General Health domain score, 0-100, higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_vt IS
    'SF-36 Vitality domain score, 0-100, higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_sf IS
    'SF-36 Social Functioning domain score, 0-100, higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_re IS
    'SF-36 Role-Emotional domain score, 0-100, higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_mh IS
    'SF-36 Mental Health domain score, 0-100, higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_pcs_approx IS
    'Simplified (non-licensed) physical-component summary approximation: unweighted mean of PF/RP/BP/GH. NOT the trademarked QualityMetric SF-36v2 PCS.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.sf36_mcs_approx IS
    'Simplified (non-licensed) mental-component summary approximation: unweighted mean of VT/SF/RE/MH. NOT the trademarked QualityMetric SF-36v2 MCS.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.ndi_raw_score IS
    'NDI raw score: sum of answered sections, 0-50 max.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.ndi_answered_sections IS
    'Count of NDI sections answered (out of 10); used to adjust the percentage for missing sections.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.ndi_percentage_score IS
    'NDI percentage score: rawScore / (5 x answeredSections) x 100. Lower = better (less disability).';
COMMENT ON COLUMN patient_reported_outcome_measures_score.ndi_band IS
    'NDI interpretation band: no-disability (0-4%), mild (5-14%), moderate (15-24%), severe (25-34%), complete (>=35%).';
COMMENT ON COLUMN patient_reported_outcome_measures_score.mjoa_total_score IS
    'mJOA total score, 0-17. Higher = less dysfunction from myelopathy.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.mjoa_band IS
    'mJOA severity band: mild (15-17), moderate (12-14), severe (0-11).';
COMMENT ON COLUMN patient_reported_outcome_measures_score.eq5d_health_state_descriptor IS
    'EQ-5D-3L 5-digit health-state descriptor (mobility, self-care, usual activities, pain/discomfort, anxiety/depression), e.g. "11123".';
COMMENT ON COLUMN patient_reported_outcome_measures_score.eq5d_uk_index_value IS
    'EQ-5D-3L index value via the Dolan (1997) UK time-trade-off tariff. Approx -0.594 (worst) to 1.0 (full health), higher = better.';
COMMENT ON COLUMN patient_reported_outcome_measures_score.eq5d_vas_score IS
    'EQ VAS score mirrored from the raw response, 0-100, higher = better.';
