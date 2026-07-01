-- Main heart-failure annual-review record: one UK primary-care structured
-- annual review (NICE NG106) for an adult with established chronic heart
-- failure, documenting review context, diagnosis and subtype, functional
-- status (NYHA), fluid balance and observations, monitoring bloods, the four
-- pillars of guideline-directed medical therapy (ACEi/ARB/ARNI, beta-blocker,
-- MRA, SGLT2 inhibitor) plus loop diuretic and other medications, devices,
-- vaccinations, and self-management, alongside patient / clinician
-- identification. The computed NYHA functional status, medication-optimisation
-- status, review-completeness grade, the audit trail of fired rules, and the
-- flags live in dedicated child tables. This is a documentation and
-- status-classification record, not a diagnostic or prescribing instrument.

CREATE TABLE heart_failure_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'practice-nurse', 'hf-nurse', 'pharmacist', 'cardiologist', 'other', '')),
    review_date DATE,
    care_setting VARCHAR(25) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'community-hf-service', 'hospital-clinic', 'other', '')),
    review_type VARCHAR(25) NOT NULL DEFAULT '' CHECK (review_type IN ('routine-annual', 'post-discharge', 'medication-titration', '')),
    last_review_date DATE,
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-59', '60-79', '>=80', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Diagnosis
    year_of_diagnosis INTEGER,
    heart_failure_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (heart_failure_type IN ('reduced', 'mildly-reduced', 'preserved', 'unknown', '')),
    latest_lvef NUMERIC(4,1),
    last_echo_date DATE,
    aetiology VARCHAR(15) NOT NULL DEFAULT '' CHECK (aetiology IN ('ischaemic', 'hypertensive', 'valvular', 'other', 'unknown', '')),

    -- Functional status
    nyha_class INTEGER CHECK (nyha_class IS NULL OR nyha_class BETWEEN 1 AND 4),
    breathlessness VARCHAR(15) NOT NULL DEFAULT '' CHECK (breathlessness IN ('none', 'on-exertion', 'at-rest', '')),
    orthopnoea VARCHAR(5) NOT NULL DEFAULT '' CHECK (orthopnoea IN ('yes', 'no', '')),
    paroxysmal_nocturnal_dyspnoea VARCHAR(5) NOT NULL DEFAULT '' CHECK (paroxysmal_nocturnal_dyspnoea IN ('yes', 'no', '')),
    fatigue VARCHAR(10) NOT NULL DEFAULT '' CHECK (fatigue IN ('none', 'mild', 'moderate', 'severe', '')),
    change_since_last_review VARCHAR(10) NOT NULL DEFAULT '' CHECK (change_since_last_review IN ('improved', 'unchanged', 'worse', '')),
    decompensation VARCHAR(5) NOT NULL DEFAULT '' CHECK (decompensation IN ('yes', 'no', '')),

    -- Fluid status and observations
    weight_kg NUMERIC(5,1),
    weight_change_kg NUMERIC(4,1),
    peripheral_oedema VARCHAR(10) NOT NULL DEFAULT '' CHECK (peripheral_oedema IN ('none', 'mild', 'moderate', 'severe', '')),
    raised_jvp VARCHAR(5) NOT NULL DEFAULT '' CHECK (raised_jvp IN ('yes', 'no', '')),
    lung_crackles VARCHAR(5) NOT NULL DEFAULT '' CHECK (lung_crackles IN ('yes', 'no', '')),
    systolic_blood_pressure INTEGER,
    diastolic_blood_pressure INTEGER,
    heart_rate INTEGER,
    heart_rhythm VARCHAR(20) NOT NULL DEFAULT '' CHECK (heart_rhythm IN ('sinus', 'atrial-fibrillation', 'paced', 'other', '')),

    -- Investigations
    nt_pro_bnp NUMERIC(7,1),
    sodium NUMERIC(4,1),
    potassium NUMERIC(3,1),
    urea NUMERIC(4,1),
    creatinine NUMERIC(5,1),
    egfr NUMERIC(5,1),
    haemoglobin NUMERIC(4,1),
    ferritin NUMERIC(6,1),
    transferrin_saturation NUMERIC(4,1),
    hba1c NUMERIC(4,1),
    bloods_date DATE,

    -- Medication pillar 1: RAAS inhibitor (ACEi / ARB / ARNI)
    raas_inhibitor_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (raas_inhibitor_status IN ('prescribed', 'not-prescribed', 'contraindicated', 'not-tolerated', '')),
    raas_inhibitor_agent VARCHAR(100) NOT NULL DEFAULT '',
    raas_inhibitor_dose VARCHAR(100) NOT NULL DEFAULT '',
    raas_inhibitor_at_target_dose VARCHAR(5) NOT NULL DEFAULT '' CHECK (raas_inhibitor_at_target_dose IN ('yes', 'no', '')),
    raas_inhibitor_adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (raas_inhibitor_adherence IN ('good', 'partial', 'poor', '')),

    -- Medication pillar 2: beta-blocker
    beta_blocker_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (beta_blocker_status IN ('prescribed', 'not-prescribed', 'contraindicated', 'not-tolerated', '')),
    beta_blocker_agent VARCHAR(100) NOT NULL DEFAULT '',
    beta_blocker_dose VARCHAR(100) NOT NULL DEFAULT '',
    beta_blocker_at_target_dose VARCHAR(5) NOT NULL DEFAULT '' CHECK (beta_blocker_at_target_dose IN ('yes', 'no', '')),
    beta_blocker_adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (beta_blocker_adherence IN ('good', 'partial', 'poor', '')),

    -- Medication pillar 3: MRA (mineralocorticoid-receptor antagonist)
    mra_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (mra_status IN ('prescribed', 'not-prescribed', 'contraindicated', 'not-tolerated', '')),
    mra_agent VARCHAR(100) NOT NULL DEFAULT '',
    mra_dose VARCHAR(100) NOT NULL DEFAULT '',
    mra_at_target_dose VARCHAR(5) NOT NULL DEFAULT '' CHECK (mra_at_target_dose IN ('yes', 'no', '')),
    mra_adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (mra_adherence IN ('good', 'partial', 'poor', '')),

    -- Medication pillar 4: SGLT2 inhibitor
    sglt2_inhibitor_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (sglt2_inhibitor_status IN ('prescribed', 'not-prescribed', 'contraindicated', 'not-tolerated', '')),
    sglt2_inhibitor_agent VARCHAR(100) NOT NULL DEFAULT '',
    sglt2_inhibitor_dose VARCHAR(100) NOT NULL DEFAULT '',
    sglt2_inhibitor_at_target_dose VARCHAR(5) NOT NULL DEFAULT '' CHECK (sglt2_inhibitor_at_target_dose IN ('yes', 'no', '')),
    sglt2_inhibitor_adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (sglt2_inhibitor_adherence IN ('good', 'partial', 'poor', '')),

    -- Other medications
    loop_diuretic_agent VARCHAR(100) NOT NULL DEFAULT '',
    loop_diuretic_dose VARCHAR(100) NOT NULL DEFAULT '',
    other_medications TEXT NOT NULL DEFAULT '',

    -- Devices
    icd VARCHAR(5) NOT NULL DEFAULT '' CHECK (icd IN ('yes', 'no', '')),
    crt VARCHAR(5) NOT NULL DEFAULT '' CHECK (crt IN ('yes', 'no', '')),
    pacemaker VARCHAR(5) NOT NULL DEFAULT '' CHECK (pacemaker IN ('yes', 'no', '')),
    device_check_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (device_check_status IN ('up-to-date', 'overdue', 'not-applicable', '')),

    -- Vaccinations
    influenza_vaccination VARCHAR(5) NOT NULL DEFAULT '' CHECK (influenza_vaccination IN ('yes', 'no', '')),
    pneumococcal_vaccination VARCHAR(5) NOT NULL DEFAULT '' CHECK (pneumococcal_vaccination IN ('yes', 'no', '')),
    covid_vaccination VARCHAR(5) NOT NULL DEFAULT '' CHECK (covid_vaccination IN ('yes', 'no', '')),

    -- Self-management and lifestyle
    smoking_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (smoking_status IN ('never', 'ex', 'current', '')),
    alcohol_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (alcohol_status IN ('none', 'within-limits', 'above-limits', '')),
    daily_weights VARCHAR(5) NOT NULL DEFAULT '' CHECK (daily_weights IN ('yes', 'no', '')),
    self_management_plan VARCHAR(5) NOT NULL DEFAULT '' CHECK (self_management_plan IN ('yes', 'no', '')),
    cardiac_rehab VARCHAR(5) NOT NULL DEFAULT '' CHECK (cardiac_rehab IN ('yes', 'no', '')),

    -- Free-text context
    review_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX heart_failure_review_patient_id_idx
    ON heart_failure_review (patient_id);
CREATE INDEX heart_failure_review_clinician_id_idx
    ON heart_failure_review (clinician_id);

CREATE TRIGGER trigger_heart_failure_review_updated_at
    BEFORE UPDATE ON heart_failure_review
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE heart_failure_review IS
    'Main heart-failure annual-review record (NICE NG106): patient and clinician identification, review context, diagnosis and subtype, functional status (NYHA), fluid balance and observations, monitoring bloods, the four pillars of guideline-directed medical therapy plus loop diuretic and other medications, devices, vaccinations, and self-management. The computed functional status, medication-optimisation status, completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN heart_failure_review.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN heart_failure_review.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN heart_failure_review.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN heart_failure_review.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN heart_failure_review.patient_id IS
    'Foreign key to the patient this review documents (restrict delete).';
COMMENT ON COLUMN heart_failure_review.clinician_id IS
    'Foreign key to the reviewing clinician (restrict delete); optional.';
COMMENT ON COLUMN heart_failure_review.clinician_name IS
    'Name of the reviewing clinician as recorded on the review.';
COMMENT ON COLUMN heart_failure_review.clinician_role IS
    'Reviewing clinician role: gp, practice-nurse, hf-nurse, pharmacist, cardiologist, or other.';
COMMENT ON COLUMN heart_failure_review.review_date IS
    'Date this annual review was conducted.';
COMMENT ON COLUMN heart_failure_review.care_setting IS
    'Care setting of the review: general-practice, community-hf-service, hospital-clinic, or other.';
COMMENT ON COLUMN heart_failure_review.review_type IS
    'Type of review: routine-annual, post-discharge, or medication-titration.';
COMMENT ON COLUMN heart_failure_review.last_review_date IS
    'Date of the previous review, used to assess change over time.';
COMMENT ON COLUMN heart_failure_review.patient_identifier IS
    'NHS number or local patient identifier as recorded on the review.';
COMMENT ON COLUMN heart_failure_review.age_band IS
    'Adult age band: 18-39, 40-59, 60-79, or >=80.';
COMMENT ON COLUMN heart_failure_review.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN heart_failure_review.year_of_diagnosis IS
    'Calendar year the heart failure was diagnosed.';
COMMENT ON COLUMN heart_failure_review.heart_failure_type IS
    'Heart-failure subtype by ejection fraction: reduced (HFrEF), mildly-reduced (HFmrEF), preserved (HFpEF), or unknown. Drives the indicated medication-pillar set.';
COMMENT ON COLUMN heart_failure_review.latest_lvef IS
    'Most recent left-ventricular ejection fraction as a percentage.';
COMMENT ON COLUMN heart_failure_review.last_echo_date IS
    'Date of the last echocardiogram.';
COMMENT ON COLUMN heart_failure_review.aetiology IS
    'Underlying aetiology: ischaemic, hypertensive, valvular, other, or unknown.';
COMMENT ON COLUMN heart_failure_review.nyha_class IS
    'New York Heart Association functional class 1-4 (null if not assessed); drives the functional-status classification.';
COMMENT ON COLUMN heart_failure_review.breathlessness IS
    'Breathlessness severity: none, on-exertion, or at-rest.';
COMMENT ON COLUMN heart_failure_review.orthopnoea IS
    'Whether orthopnoea is present (yes/no).';
COMMENT ON COLUMN heart_failure_review.paroxysmal_nocturnal_dyspnoea IS
    'Whether paroxysmal nocturnal dyspnoea is present (yes/no).';
COMMENT ON COLUMN heart_failure_review.fatigue IS
    'Fatigue severity: none, mild, moderate, or severe.';
COMMENT ON COLUMN heart_failure_review.change_since_last_review IS
    'Overall change in symptoms since the last review: improved, unchanged, or worse.';
COMMENT ON COLUMN heart_failure_review.decompensation IS
    'Whether a documented decompensation has occurred since the last review (yes/no).';
COMMENT ON COLUMN heart_failure_review.weight_kg IS
    'Current body weight in kilograms.';
COMMENT ON COLUMN heart_failure_review.weight_change_kg IS
    'Change in weight in kilograms since the last review (positive = gain).';
COMMENT ON COLUMN heart_failure_review.peripheral_oedema IS
    'Peripheral oedema severity: none, mild, moderate, or severe.';
COMMENT ON COLUMN heart_failure_review.raised_jvp IS
    'Whether the jugular venous pressure is raised (yes/no).';
COMMENT ON COLUMN heart_failure_review.lung_crackles IS
    'Whether pulmonary crackles are present on auscultation (yes/no).';
COMMENT ON COLUMN heart_failure_review.systolic_blood_pressure IS
    'Systolic blood pressure in mmHg.';
COMMENT ON COLUMN heart_failure_review.diastolic_blood_pressure IS
    'Diastolic blood pressure in mmHg.';
COMMENT ON COLUMN heart_failure_review.heart_rate IS
    'Heart rate in beats per minute.';
COMMENT ON COLUMN heart_failure_review.heart_rhythm IS
    'Heart rhythm: sinus, atrial-fibrillation, paced, or other.';
COMMENT ON COLUMN heart_failure_review.nt_pro_bnp IS
    'NT-proBNP natriuretic peptide in ng/L.';
COMMENT ON COLUMN heart_failure_review.sodium IS
    'Serum sodium in mmol/L (U&E).';
COMMENT ON COLUMN heart_failure_review.potassium IS
    'Serum potassium in mmol/L (U&E); RAAS-inhibitor / MRA monitoring value.';
COMMENT ON COLUMN heart_failure_review.urea IS
    'Serum urea in mmol/L (U&E).';
COMMENT ON COLUMN heart_failure_review.creatinine IS
    'Serum creatinine in micromol/L (U&E).';
COMMENT ON COLUMN heart_failure_review.egfr IS
    'Estimated glomerular filtration rate in mL/min/1.73m^2; RAAS-inhibitor / MRA safety value.';
COMMENT ON COLUMN heart_failure_review.haemoglobin IS
    'Haemoglobin in g/L.';
COMMENT ON COLUMN heart_failure_review.ferritin IS
    'Serum ferritin in micrograms/L (iron status).';
COMMENT ON COLUMN heart_failure_review.transferrin_saturation IS
    'Transferrin saturation as a percentage (iron status).';
COMMENT ON COLUMN heart_failure_review.hba1c IS
    'HbA1c in mmol/mol (glycaemic control).';
COMMENT ON COLUMN heart_failure_review.bloods_date IS
    'Date the monitoring bloods were taken.';
COMMENT ON COLUMN heart_failure_review.raas_inhibitor_status IS
    'RAAS-inhibitor (ACEi/ARB/ARNI) pillar prescribing status: prescribed, not-prescribed, contraindicated, or not-tolerated.';
COMMENT ON COLUMN heart_failure_review.raas_inhibitor_agent IS
    'RAAS-inhibitor agent name.';
COMMENT ON COLUMN heart_failure_review.raas_inhibitor_dose IS
    'RAAS-inhibitor current dose.';
COMMENT ON COLUMN heart_failure_review.raas_inhibitor_at_target_dose IS
    'Whether the RAAS inhibitor is at guideline target dose (yes/no).';
COMMENT ON COLUMN heart_failure_review.raas_inhibitor_adherence IS
    'RAAS-inhibitor self-reported adherence: good, partial, or poor.';
COMMENT ON COLUMN heart_failure_review.beta_blocker_status IS
    'Beta-blocker pillar prescribing status: prescribed, not-prescribed, contraindicated, or not-tolerated.';
COMMENT ON COLUMN heart_failure_review.beta_blocker_agent IS
    'Beta-blocker agent name.';
COMMENT ON COLUMN heart_failure_review.beta_blocker_dose IS
    'Beta-blocker current dose.';
COMMENT ON COLUMN heart_failure_review.beta_blocker_at_target_dose IS
    'Whether the beta-blocker is at guideline target dose (yes/no).';
COMMENT ON COLUMN heart_failure_review.beta_blocker_adherence IS
    'Beta-blocker self-reported adherence: good, partial, or poor.';
COMMENT ON COLUMN heart_failure_review.mra_status IS
    'MRA (mineralocorticoid-receptor antagonist) pillar prescribing status: prescribed, not-prescribed, contraindicated, or not-tolerated.';
COMMENT ON COLUMN heart_failure_review.mra_agent IS
    'MRA agent name.';
COMMENT ON COLUMN heart_failure_review.mra_dose IS
    'MRA current dose.';
COMMENT ON COLUMN heart_failure_review.mra_at_target_dose IS
    'Whether the MRA is at guideline target dose (yes/no).';
COMMENT ON COLUMN heart_failure_review.mra_adherence IS
    'MRA self-reported adherence: good, partial, or poor.';
COMMENT ON COLUMN heart_failure_review.sglt2_inhibitor_status IS
    'SGLT2-inhibitor pillar prescribing status: prescribed, not-prescribed, contraindicated, or not-tolerated.';
COMMENT ON COLUMN heart_failure_review.sglt2_inhibitor_agent IS
    'SGLT2-inhibitor agent name.';
COMMENT ON COLUMN heart_failure_review.sglt2_inhibitor_dose IS
    'SGLT2-inhibitor current dose.';
COMMENT ON COLUMN heart_failure_review.sglt2_inhibitor_at_target_dose IS
    'Whether the SGLT2 inhibitor is at guideline target dose (yes/no).';
COMMENT ON COLUMN heart_failure_review.sglt2_inhibitor_adherence IS
    'SGLT2-inhibitor self-reported adherence: good, partial, or poor.';
COMMENT ON COLUMN heart_failure_review.loop_diuretic_agent IS
    'Loop-diuretic agent name (symptom control, not a disease-modifying pillar).';
COMMENT ON COLUMN heart_failure_review.loop_diuretic_dose IS
    'Loop-diuretic current dose.';
COMMENT ON COLUMN heart_failure_review.other_medications IS
    'Free-text list of other relevant medications.';
COMMENT ON COLUMN heart_failure_review.icd IS
    'Whether the patient has an implantable cardioverter-defibrillator (yes/no).';
COMMENT ON COLUMN heart_failure_review.crt IS
    'Whether the patient has cardiac resynchronisation therapy (yes/no).';
COMMENT ON COLUMN heart_failure_review.pacemaker IS
    'Whether the patient has a pacemaker (yes/no).';
COMMENT ON COLUMN heart_failure_review.device_check_status IS
    'Cardiac-device check status: up-to-date, overdue, or not-applicable.';
COMMENT ON COLUMN heart_failure_review.influenza_vaccination IS
    'Whether seasonal influenza vaccination is up to date (yes/no).';
COMMENT ON COLUMN heart_failure_review.pneumococcal_vaccination IS
    'Whether pneumococcal vaccination is up to date (yes/no).';
COMMENT ON COLUMN heart_failure_review.covid_vaccination IS
    'Whether COVID-19 vaccination is up to date (yes/no).';
COMMENT ON COLUMN heart_failure_review.smoking_status IS
    'Smoking status: never, ex, or current.';
COMMENT ON COLUMN heart_failure_review.alcohol_status IS
    'Alcohol use: none, within-limits, or above-limits.';
COMMENT ON COLUMN heart_failure_review.daily_weights IS
    'Whether the patient monitors daily weights (yes/no).';
COMMENT ON COLUMN heart_failure_review.self_management_plan IS
    'Whether a self-management plan is documented and in place (yes/no).';
COMMENT ON COLUMN heart_failure_review.cardiac_rehab IS
    'Whether the patient has attended or been referred to cardiac rehabilitation (yes/no).';
COMMENT ON COLUMN heart_failure_review.review_context IS
    'Optional free-text review context or narrative shown in the summary.';
