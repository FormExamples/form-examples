-- Main Bhutani bilirubin nomogram assessment record: assessment context,
-- infant identification, the measurement inputs (age in hours, total serum
-- bilirubin, measurement method, gestational age), and the neonatal
-- hyperbilirubinaemia risk factors. The computed risk zone, threshold
-- comparison, fired rules, and flags live in dedicated child tables.

CREATE TABLE bhutani_bilirubin_nomogram (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('midwife', 'neonatal-nurse', 'paediatrician', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('postnatal-ward', 'neonatal-unit', 'midwife-led-unit', 'community', 'other', '')),
    infant_identifier VARCHAR(100) NOT NULL DEFAULT '',
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    born_at TIMESTAMPTZ,
    gestational_age_weeks NUMERIC(4,1),

    -- Step 2: measurement inputs
    age_hours NUMERIC(6,1),
    total_serum_bilirubin_umol_l NUMERIC(6,1),
    measurement_method VARCHAR(20) NOT NULL DEFAULT '' CHECK (measurement_method IN ('serum', 'transcutaneous', '')),

    -- Step 3: risk factors (each yes/no)
    preterm_under_38 VARCHAR(5) NOT NULL DEFAULT '' CHECK (preterm_under_38 IN ('yes', 'no', '')),
    previous_sibling_jaundice VARCHAR(5) NOT NULL DEFAULT '' CHECK (previous_sibling_jaundice IN ('yes', 'no', '')),
    exclusive_breastfeeding VARCHAR(5) NOT NULL DEFAULT '' CHECK (exclusive_breastfeeding IN ('yes', 'no', '')),
    bruising VARCHAR(5) NOT NULL DEFAULT '' CHECK (bruising IN ('yes', 'no', '')),
    blood_group_incompatibility VARCHAR(5) NOT NULL DEFAULT '' CHECK (blood_group_incompatibility IN ('yes', 'no', '')),
    early_onset_under_24h VARCHAR(5) NOT NULL DEFAULT '' CHECK (early_onset_under_24h IN ('yes', 'no', '')),

    -- Step 4: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX bhutani_bilirubin_nomogram_patient_id_idx
    ON bhutani_bilirubin_nomogram (patient_id);
CREATE INDEX bhutani_bilirubin_nomogram_clinician_id_idx
    ON bhutani_bilirubin_nomogram (clinician_id);

CREATE TRIGGER trigger_bhutani_bilirubin_nomogram_updated_at
    BEFORE UPDATE ON bhutani_bilirubin_nomogram
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bhutani_bilirubin_nomogram IS
    'Main Bhutani bilirubin nomogram assessment record: assessment context, infant identification, measurement inputs (age in hours, total serum bilirubin, measurement method, gestational age), and neonatal hyperbilirubinaemia risk factors.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.patient_id IS
    'Foreign key to the infant being assessed (delete restricted).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.clinician_role IS
    'Role of the assessing clinician: midwife, neonatal-nurse, paediatrician, or other.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.care_setting IS
    'Care setting: postnatal-ward, neonatal-unit, midwife-led-unit, community, or other.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.infant_identifier IS
    'Local infant identifier as recorded on the assessment.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.sex IS
    'Infant sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.born_at IS
    'Date and time of birth; used with assessed_at to derive age in hours.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.gestational_age_weeks IS
    'Gestational age at birth in completed weeks; selects the gestation-specific threshold curve.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.age_hours IS
    'Age at measurement in hours; the nomogram x-axis (may be derived from born_at and assessed_at or entered directly).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.total_serum_bilirubin_umol_l IS
    'Measured total serum bilirubin (TSB) in micromoles per litre (umol/L); the nomogram y-axis.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.measurement_method IS
    'Bilirubin measurement method: serum or transcutaneous.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.preterm_under_38 IS
    'Risk factor (yes/no): gestational age below 38 weeks.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.previous_sibling_jaundice IS
    'Risk factor (yes/no): previous sibling required phototherapy or had neonatal jaundice.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.exclusive_breastfeeding IS
    'Risk factor (yes/no): infant is exclusively breastfed.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.bruising IS
    'Risk factor (yes/no): significant bruising or cephalohaematoma.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.blood_group_incompatibility IS
    'Risk factor (yes/no): ABO or Rhesus incompatibility, or positive direct antiglobulin test (DAT).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.early_onset_under_24h IS
    'Risk factor (yes/no): jaundice onset before 24 hours of age.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
