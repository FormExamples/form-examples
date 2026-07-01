-- Main Parkland-formula burns record: context and identification, plus the
-- calculation inputs (body weight, %TBSA burned, time of injury) and the
-- injury-feature flags that drive the red flags. The computed 24-hour volume,
-- phase split, infusion rates, urine-output target, fired rules, and safety
-- flags live in dedicated child tables.

CREATE TABLE parkland_formula_for_burns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'paramedic', 'other', '')),
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'burns-unit', 'intensive-care', 'retrieval', 'other', '')),
    assessed_at TIMESTAMPTZ,
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('adult', 'child', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Calculation inputs
    weight_kg NUMERIC(5,1),
    tbsa_percent NUMERIC(5,2),
    tbsa_method VARCHAR(20) NOT NULL DEFAULT '' CHECK (tbsa_method IN ('rule-of-nines', 'lund-browder', 'other', '')),
    injury_at TIMESTAMPTZ,
    injury_time_known VARCHAR(10) NOT NULL DEFAULT '' CHECK (injury_time_known IN ('known', 'estimated', '')),

    -- Injury features (drive flags, not the arithmetic)
    inhalation_suspected VARCHAR(5) NOT NULL DEFAULT '' CHECK (inhalation_suspected IN ('yes', 'no', '')),
    circumferential_or_deep VARCHAR(5) NOT NULL DEFAULT '' CHECK (circumferential_or_deep IN ('yes', 'no', '')),
    mechanism VARCHAR(15) NOT NULL DEFAULT '' CHECK (mechanism IN ('thermal', 'electrical', 'chemical', 'other', ''))
);

CREATE INDEX parkland_formula_for_burns_patient_id_idx
    ON parkland_formula_for_burns (patient_id);
CREATE INDEX parkland_formula_for_burns_clinician_id_idx
    ON parkland_formula_for_burns (clinician_id);

CREATE TRIGGER trigger_parkland_formula_for_burns_updated_at
    BEFORE UPDATE ON parkland_formula_for_burns
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE parkland_formula_for_burns IS
    'Main Parkland-formula burns record: context and identification, plus the body weight, %TBSA, and time-of-injury inputs and the injury-feature flags.';
COMMENT ON COLUMN parkland_formula_for_burns.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN parkland_formula_for_burns.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN parkland_formula_for_burns.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN parkland_formula_for_burns.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN parkland_formula_for_burns.patient_id IS
    'Foreign key to the patient this calculation is for (restricted delete).';
COMMENT ON COLUMN parkland_formula_for_burns.clinician_id IS
    'Foreign key to the clinician who recorded the calculation (optional, restricted delete).';
COMMENT ON COLUMN parkland_formula_for_burns.clinician_name IS
    'Assessing clinician name as recorded on the form.';
COMMENT ON COLUMN parkland_formula_for_burns.clinician_role IS
    'Assessing clinician role: doctor, nurse, paramedic, or other.';
COMMENT ON COLUMN parkland_formula_for_burns.care_setting IS
    'Care setting: emergency-department, burns-unit, intensive-care, retrieval, or other.';
COMMENT ON COLUMN parkland_formula_for_burns.assessed_at IS
    'Date and time the calculation was assessed (used with injury_at to derive hours since injury).';
COMMENT ON COLUMN parkland_formula_for_burns.patient_identifier IS
    'Local patient identifier as recorded on the form.';
COMMENT ON COLUMN parkland_formula_for_burns.age_band IS
    'Age band that selects the major-burn referral threshold: adult (>=15% TBSA) or child (>=10% TBSA).';
COMMENT ON COLUMN parkland_formula_for_burns.sex IS
    'Patient sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN parkland_formula_for_burns.weight_kg IS
    'Body weight in kilograms used in the Parkland formula (null when unanswered).';
COMMENT ON COLUMN parkland_formula_for_burns.tbsa_percent IS
    'Percentage total body surface area burned (partial-thickness or deeper; superficial excluded), 0-100 (null when unanswered).';
COMMENT ON COLUMN parkland_formula_for_burns.tbsa_method IS
    'Method used to estimate %TBSA: rule-of-nines, lund-browder, or other.';
COMMENT ON COLUMN parkland_formula_for_burns.injury_at IS
    'Date and time the burn occurred; the 8h/16h phase split is measured from this instant (null when unanswered).';
COMMENT ON COLUMN parkland_formula_for_burns.injury_time_known IS
    'Whether the time of injury is known or estimated.';
COMMENT ON COLUMN parkland_formula_for_burns.inhalation_suspected IS
    'Whether inhalation / airway injury is suspected: yes or no.';
COMMENT ON COLUMN parkland_formula_for_burns.circumferential_or_deep IS
    'Whether a circumferential or deep burn is present (escharotomy risk): yes or no.';
COMMENT ON COLUMN parkland_formula_for_burns.mechanism IS
    'Burn mechanism: thermal, electrical, chemical, or other.';
