-- Main Centor score assessment record: assessment context, patient
-- identification, the four objective Centor criterion inputs (tonsillar
-- exudate, tender anterior cervical nodes, fever, absence of cough), the
-- optional measured temperature, the patient age that drives the McIsaac
-- modifier, and the airway / quinsy red-flag inputs. The computed grade,
-- fired rules, and flags live in dedicated child tables.

CREATE TABLE centor_score_for_streptococcal_pharyngitis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'nurse-practitioner', 'pharmacist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'urgent-care', 'pharmacy', 'emergency-department', 'other', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years INT,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: Centor criterion 1 — tonsillar exudate or swelling
    tonsillar_exudate VARCHAR(3) NOT NULL DEFAULT '' CHECK (tonsillar_exudate IN ('yes', 'no', '')),

    -- Step 4: Centor criterion 2 — tender anterior cervical lymphadenopathy
    tender_anterior_cervical_nodes VARCHAR(3) NOT NULL DEFAULT '' CHECK (tender_anterior_cervical_nodes IN ('yes', 'no', '')),

    -- Step 5: Centor criterion 3 — fever (> 38 C or history of fever)
    fever_over_38 VARCHAR(3) NOT NULL DEFAULT '' CHECK (fever_over_38 IN ('yes', 'no', '')),
    measured_temperature_celsius NUMERIC(4,1),

    -- Step 6: Centor criterion 4 — absence of cough (scores when cough is absent)
    absence_of_cough VARCHAR(3) NOT NULL DEFAULT '' CHECK (absence_of_cough IN ('yes', 'no', '')),

    -- Step 7: airway / quinsy red-flag inputs
    stridor_or_breathing_difficulty VARCHAR(3) NOT NULL DEFAULT '' CHECK (stridor_or_breathing_difficulty IN ('yes', 'no', '')),
    drooling_or_cannot_swallow VARCHAR(3) NOT NULL DEFAULT '' CHECK (drooling_or_cannot_swallow IN ('yes', 'no', '')),
    trismus VARCHAR(3) NOT NULL DEFAULT '' CHECK (trismus IN ('yes', 'no', '')),
    muffled_voice VARCHAR(3) NOT NULL DEFAULT '' CHECK (muffled_voice IN ('yes', 'no', '')),
    unilateral_neck_swelling VARCHAR(3) NOT NULL DEFAULT '' CHECK (unilateral_neck_swelling IN ('yes', 'no', '')),

    -- Step 8: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX centor_score_for_streptococcal_pharyngitis_patient_id_idx
    ON centor_score_for_streptococcal_pharyngitis (patient_id);
CREATE INDEX centor_score_for_streptococcal_pharyngitis_clinician_id_idx
    ON centor_score_for_streptococcal_pharyngitis (clinician_id);

CREATE TRIGGER trigger_centor_score_for_streptococcal_pharyngitis_updated_at
    BEFORE UPDATE ON centor_score_for_streptococcal_pharyngitis
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE centor_score_for_streptococcal_pharyngitis IS
    'Main Centor score assessment record: assessment context, patient identification, the four Centor criterion inputs, the optional measured temperature, the patient age driving the McIsaac modifier, and the airway / quinsy red-flag inputs.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.clinician_role IS
    'Role of the assessing clinician: gp, nurse-practitioner, pharmacist, or other.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.care_setting IS
    'Care setting: general-practice, urgent-care, pharmacy, emergency-department, or other.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.age_years IS
    'Patient age in whole years; drives the McIsaac age modifier (+1 ages 3-14, 0 ages 15-44, -1 ages 45+). Null raises a data-completeness flag and applies a modifier of 0.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.tonsillar_exudate IS
    'Centor criterion 1 — tonsillar exudate or swelling present: yes scores 1 point.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.tender_anterior_cervical_nodes IS
    'Centor criterion 2 — tender anterior cervical lymphadenopathy present: yes scores 1 point.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.fever_over_38 IS
    'Centor criterion 3 — temperature > 38 C or a history of fever: yes scores 1 point (also set when measured_temperature_celsius exceeds 38).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.measured_temperature_celsius IS
    'Optional measured temperature in degrees Celsius; a value above 38.0 sets the fever criterion.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.absence_of_cough IS
    'Centor criterion 4 — cough absent: yes (cough absent) scores 1 point.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.stridor_or_breathing_difficulty IS
    'Red-flag input — stridor or difficulty breathing (airway compromise): yes.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.drooling_or_cannot_swallow IS
    'Red-flag input — drooling or inability to swallow (airway / peritonsillar abscess): yes.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.trismus IS
    'Red-flag input — trismus (peritonsillar abscess / quinsy): yes.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.muffled_voice IS
    'Red-flag input — muffled ("hot potato") voice (peritonsillar abscess / quinsy): yes.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.unilateral_neck_swelling IS
    'Red-flag input — unilateral neck swelling (peritonsillar abscess / quinsy): yes.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
