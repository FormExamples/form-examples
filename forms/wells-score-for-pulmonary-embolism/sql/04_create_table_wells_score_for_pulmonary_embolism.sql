-- Main Wells PE assessment record: identification, context, and the seven
-- weighted clinical criterion inputs. Each criterion is a yes/no/'' enum,
-- scored as present only when 'yes' and contributing its weight (+3, +1.5, or
-- +1). The computed score, bands, fired rules, and flags live in dedicated
-- child tables.

CREATE TABLE wells_score_for_pulmonary_embolism (
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
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'acute-medical-unit', 'ambulatory', 'other', '')),
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-64', '65-74', '75-84', '85-plus', '')),
    haemodynamic_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (haemodynamic_status IN ('stable', 'unstable', '')),

    -- Criterion inputs (each scored by its weight when 'yes')
    clinical_signs_of_dvt VARCHAR(5) NOT NULL DEFAULT '' CHECK (clinical_signs_of_dvt IN ('yes', 'no', '')),
    pe_most_likely VARCHAR(5) NOT NULL DEFAULT '' CHECK (pe_most_likely IN ('yes', 'no', '')),
    heart_rate_over_100 VARCHAR(5) NOT NULL DEFAULT '' CHECK (heart_rate_over_100 IN ('yes', 'no', '')),
    immobilisation_or_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (immobilisation_or_surgery IN ('yes', 'no', '')),
    previous_dvt_pe VARCHAR(5) NOT NULL DEFAULT '' CHECK (previous_dvt_pe IN ('yes', 'no', '')),
    haemoptysis VARCHAR(5) NOT NULL DEFAULT '' CHECK (haemoptysis IN ('yes', 'no', '')),
    malignancy VARCHAR(5) NOT NULL DEFAULT '' CHECK (malignancy IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX wells_score_for_pulmonary_embolism_patient_id_idx
    ON wells_score_for_pulmonary_embolism (patient_id);
CREATE INDEX wells_score_for_pulmonary_embolism_clinician_id_idx
    ON wells_score_for_pulmonary_embolism (clinician_id);

CREATE TRIGGER trigger_wells_score_for_pulmonary_embolism_updated_at
    BEFORE UPDATE ON wells_score_for_pulmonary_embolism
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE wells_score_for_pulmonary_embolism IS
    'Main Wells PE assessment record: identification, context, and the seven weighted clinical criterion inputs.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.patient_id IS
    'Foreign key to the patient being assessed (restricts delete).';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.clinician_id IS
    'Foreign key to the assessing clinician (restricts delete).';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.patient_identifier IS
    'Local patient identifier as recorded at the point of assessment.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.assessed_at IS
    'Date and time the assessment was carried out.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.care_setting IS
    'Care setting: emergency-department, acute-medical-unit, ambulatory, or other.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.age_band IS
    'Adult age band: 18-39, 40-64, 65-74, 75-84, or 85-plus.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.haemodynamic_status IS
    'Haemodynamic status: stable or unstable (unstable suggests massive PE).';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.clinical_signs_of_dvt IS
    'Criterion 1 (+3): clinical signs and symptoms of DVT.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.pe_most_likely IS
    'Criterion 2 (+3): PE is the number-one diagnosis, or equally likely.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.heart_rate_over_100 IS
    'Criterion 3 (+1.5): heart rate greater than 100 beats per minute.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.immobilisation_or_surgery IS
    'Criterion 4 (+1.5): immobilisation for at least 3 days, or surgery in the previous 4 weeks.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.previous_dvt_pe IS
    'Criterion 5 (+1.5): previous, objectively diagnosed DVT or PE.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.haemoptysis IS
    'Criterion 6 (+1): haemoptysis.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.malignancy IS
    'Criterion 7 (+1): malignancy on treatment, treated within 6 months, or palliative.';
COMMENT ON COLUMN wells_score_for_pulmonary_embolism.clinical_notes IS
    'Free-text clinical notes captured alongside the assessment.';
