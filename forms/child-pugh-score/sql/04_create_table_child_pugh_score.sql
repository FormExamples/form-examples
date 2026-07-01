-- Main Child-Pugh assessment record: assessment context, patient
-- identification, and the five scored parameter inputs (total
-- bilirubin, serum albumin, coagulation, ascites, hepatic
-- encephalopathy). The computed grade, fired rules, and flags live in
-- dedicated child tables.

CREATE TABLE child_pugh_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('hepatologist', 'surgeon', 'anaesthetist', 'physician', 'nurse', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('hepatology-clinic', 'ward', 'pre-operative', 'intensive-care', 'other', '')),
    aetiology VARCHAR(20) NOT NULL DEFAULT '' CHECK (aetiology IN ('alcohol', 'viral-hepatitis', 'nafld', 'autoimmune', 'cholestatic', 'other', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: total bilirubin (parameter 1)
    total_bilirubin_umol_l NUMERIC(6,1),

    -- Step 4: serum albumin (parameter 2)
    serum_albumin_g_l NUMERIC(5,1),

    -- Step 5: coagulation (parameter 3) — INR preferred; PT prolongation is the fallback
    inr NUMERIC(4,2),
    prothrombin_time_seconds NUMERIC(4,1),

    -- Step 6: ascites (parameter 4)
    ascites VARCHAR(20) NOT NULL DEFAULT '' CHECK (ascites IN ('none', 'mild', 'moderate-severe', '')),

    -- Step 7: hepatic encephalopathy (parameter 5)
    hepatic_encephalopathy VARCHAR(20) NOT NULL DEFAULT '' CHECK (hepatic_encephalopathy IN ('none', 'grade-1-2', 'grade-3-4', '')),

    -- Step 8: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX child_pugh_score_patient_id_idx
    ON child_pugh_score (patient_id);
CREATE INDEX child_pugh_score_clinician_id_idx
    ON child_pugh_score (clinician_id);

CREATE TRIGGER trigger_child_pugh_score_updated_at
    BEFORE UPDATE ON child_pugh_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE child_pugh_score IS
    'Main Child-Pugh assessment record: assessment context, patient identification, and the five scored parameter inputs (total bilirubin, serum albumin, coagulation, ascites, hepatic encephalopathy).';
COMMENT ON COLUMN child_pugh_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_pugh_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN child_pugh_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN child_pugh_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN child_pugh_score.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN child_pugh_score.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN child_pugh_score.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN child_pugh_score.clinician_role IS
    'Role of the assessing clinician: hepatologist, surgeon, anaesthetist, physician, nurse, or other.';
COMMENT ON COLUMN child_pugh_score.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN child_pugh_score.care_setting IS
    'Care setting: hepatology-clinic, ward, pre-operative, intensive-care, or other.';
COMMENT ON COLUMN child_pugh_score.aetiology IS
    'Aetiology of liver disease: alcohol, viral-hepatitis, nafld, autoimmune, cholestatic, or other.';
COMMENT ON COLUMN child_pugh_score.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN child_pugh_score.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN child_pugh_score.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN child_pugh_score.total_bilirubin_umol_l IS
    'Parameter 1 — measured total bilirubin in micromoles per litre (umol/L).';
COMMENT ON COLUMN child_pugh_score.serum_albumin_g_l IS
    'Parameter 2 — measured serum albumin in grams per litre (g/L).';
COMMENT ON COLUMN child_pugh_score.inr IS
    'Parameter 3 — International Normalised Ratio (INR); preferred coagulation measure.';
COMMENT ON COLUMN child_pugh_score.prothrombin_time_seconds IS
    'Parameter 3 — prothrombin-time prolongation in seconds; fallback used when INR is unavailable.';
COMMENT ON COLUMN child_pugh_score.ascites IS
    'Parameter 4 — clinical ascites grade: none, mild (diuretic-responsive), or moderate-severe (refractory).';
COMMENT ON COLUMN child_pugh_score.hepatic_encephalopathy IS
    'Parameter 5 — hepatic encephalopathy grade: none, grade-1-2, or grade-3-4.';
COMMENT ON COLUMN child_pugh_score.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
