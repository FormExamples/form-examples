-- Main PERC (Pulmonary Embolism Rule-out Criteria) assessment record:
-- identification, context, the clinician gestalt pre-test probability gate, and
-- the eight objective criterion inputs. Each criterion is a yes/no/'' enum that
-- records whether the reassuring state is positively documented; PERC-negative
-- requires the pre-test probability to be 'low' AND all eight criteria 'yes'.
-- The computed classification, fired rules, and flags live in child tables.

CREATE TABLE pulmonary_embolism_rule_out_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'amended', 'signed', '')),

    -- Context and identification
    patient_identifier VARCHAR(64) NOT NULL DEFAULT '',
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'acute-ambulatory', 'other', '')),
    presenting_complaint TEXT NOT NULL DEFAULT '',
    age NUMERIC(3,0),
    heart_rate NUMERIC(3,0),
    oxygen_saturation NUMERIC(3,0),

    -- Applicability gate: PERC applies only when the gestalt pre-test probability is 'low'
    pretest_probability VARCHAR(10) NOT NULL DEFAULT '' CHECK (pretest_probability IN ('low', 'not-low', '')),

    -- The eight objective criterion inputs (satisfied only when 'yes')
    age_under_50 VARCHAR(5) NOT NULL DEFAULT '' CHECK (age_under_50 IN ('yes', 'no', '')),
    heart_rate_under_100 VARCHAR(5) NOT NULL DEFAULT '' CHECK (heart_rate_under_100 IN ('yes', 'no', '')),
    spo2_at_least_95 VARCHAR(5) NOT NULL DEFAULT '' CHECK (spo2_at_least_95 IN ('yes', 'no', '')),
    no_unilateral_leg_swelling VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_unilateral_leg_swelling IN ('yes', 'no', '')),
    no_haemoptysis VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_haemoptysis IN ('yes', 'no', '')),
    no_recent_surgery_trauma VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_recent_surgery_trauma IN ('yes', 'no', '')),
    no_prior_dvt_pe VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_prior_dvt_pe IN ('yes', 'no', '')),
    no_oestrogen_use VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_oestrogen_use IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX pulmonary_embolism_rule_out_criteria_patient_id_idx
    ON pulmonary_embolism_rule_out_criteria (patient_id);
CREATE INDEX pulmonary_embolism_rule_out_criteria_clinician_id_idx
    ON pulmonary_embolism_rule_out_criteria (clinician_id);

CREATE TRIGGER trigger_pulmonary_embolism_rule_out_criteria_updated_at
    BEFORE UPDATE ON pulmonary_embolism_rule_out_criteria
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pulmonary_embolism_rule_out_criteria IS
    'Main PERC assessment record: identification, context, the pre-test probability gate, and the eight objective criterion inputs.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.patient_id IS
    'Foreign key to the patient being assessed (restricts delete).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.clinician_id IS
    'Foreign key to the assessing clinician (restricts delete).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.patient_identifier IS
    'Local patient identifier as recorded at the point of assessment.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.assessed_at IS
    'Date and time the assessment was carried out.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.care_setting IS
    'Care setting: emergency-department, acute-ambulatory, or other.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.presenting_complaint IS
    'Symptom prompting consideration of pulmonary embolism.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.age IS
    'Patient age in years; the objective measurement behind criterion 1 (age < 50).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.heart_rate IS
    'Heart rate in beats per minute; the objective measurement behind criterion 2 (heart rate < 100).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.oxygen_saturation IS
    'Oxygen saturation (SpO2) as a percentage; the objective measurement behind criterion 3 (SpO2 >= 95).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.pretest_probability IS
    'Clinician gestalt pre-test probability: low or not-low. PERC applies only when low.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.age_under_50 IS
    'Criterion 1 (satisfied when yes): age under 50 years.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.heart_rate_under_100 IS
    'Criterion 2 (satisfied when yes): heart rate under 100 beats per minute.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.spo2_at_least_95 IS
    'Criterion 3 (satisfied when yes): oxygen saturation at least 95 per cent.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.no_unilateral_leg_swelling IS
    'Criterion 4 (satisfied when yes): no unilateral leg swelling.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.no_haemoptysis IS
    'Criterion 5 (satisfied when yes): no haemoptysis.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.no_recent_surgery_trauma IS
    'Criterion 6 (satisfied when yes): no surgery or trauma within 4 weeks requiring general anaesthesia.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.no_prior_dvt_pe IS
    'Criterion 7 (satisfied when yes): no prior deep vein thrombosis or pulmonary embolism.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.no_oestrogen_use IS
    'Criterion 8 (satisfied when yes): no exogenous oestrogen use.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria.clinical_notes IS
    'Free-text clinical notes captured alongside the assessment.';
