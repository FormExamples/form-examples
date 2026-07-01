-- Main COPD annual-review record: one UK primary-care annual review for an
-- adult with confirmed chronic obstructive pulmonary disease (NICE NG115,
-- GOLD 2023+) documenting review context, diagnosis and exposure history,
-- post-bronchodilator spirometry, symptom burden (MRC / mMRC / CAT),
-- exacerbation history, smoking and cessation, inhaler therapy, technique and
-- adherence, vaccinations, pulmonary rehabilitation, oxygen, comorbidities,
-- and the self-management plan, plus patient / clinician identification. The
-- computed GOLD airflow grade, ABE assessment group, review-completeness
-- grade, the audit trail of fired rules, and the flags live in dedicated
-- child tables. This is a documentation, completeness and
-- severity-classification record, not a diagnostic or prescribing instrument.

CREATE TABLE chronic_obstructive_pulmonary_disease_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'practice-nurse', 'respiratory-nurse', 'pharmacist', 'other', '')),
    reviewed_at DATE,
    review_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (review_type IN ('routine-annual', 'post-exacerbation', 'opportunistic', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-59', '60-79', '>=80', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Diagnosis and history
    diagnosis_year INTEGER,
    spirometry_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (spirometry_confirmed IN ('yes', 'no', '')),
    exposure_notes TEXT NOT NULL DEFAULT '',

    -- Spirometry (post-bronchodilator)
    fev1_litres NUMERIC(4,2),
    fev1_percent_predicted NUMERIC(5,1),
    fvc_litres NUMERIC(4,2),
    fev1_fvc_ratio NUMERIC(4,3),
    spirometry_date DATE,

    -- Symptom burden
    mrc_grade INTEGER,
    mmrc_grade INTEGER,
    cat_score INTEGER,

    -- Exacerbations (past 12 months)
    exacerbations_last_12m INTEGER,
    hospitalisations_last_12m INTEGER,
    last_exacerbation_date DATE,
    rescue_pack_courses INTEGER,

    -- Smoking and cessation
    smoking_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (smoking_status IN ('current', 'ex', 'never', '')),
    pack_years NUMERIC(4,1),
    cessation_support_offered VARCHAR(5) NOT NULL DEFAULT '' CHECK (cessation_support_offered IN ('yes', 'no', '')),

    -- Inhaler therapy
    inhaled_therapy TEXT NOT NULL DEFAULT '',
    device_type TEXT NOT NULL DEFAULT '',
    inhaler_technique_checked VARCHAR(5) NOT NULL DEFAULT '' CHECK (inhaler_technique_checked IN ('yes', 'no', '')),
    inhaler_technique_adequate VARCHAR(5) NOT NULL DEFAULT '' CHECK (inhaler_technique_adequate IN ('yes', 'no', '')),
    adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (adherence IN ('good', 'partial', 'poor', '')),

    -- Vaccinations
    influenza_vaccine VARCHAR(15) NOT NULL DEFAULT '' CHECK (influenza_vaccine IN ('up-to-date', 'due', 'declined', '')),
    pneumococcal_vaccine VARCHAR(15) NOT NULL DEFAULT '' CHECK (pneumococcal_vaccine IN ('up-to-date', 'due', 'declined', '')),
    covid_vaccine VARCHAR(15) NOT NULL DEFAULT '' CHECK (covid_vaccine IN ('up-to-date', 'due', 'declined', '')),

    -- Pulmonary rehabilitation, oxygen and self-management
    pulmonary_rehab_status VARCHAR(25) NOT NULL DEFAULT '' CHECK (pulmonary_rehab_status IN ('completed', 'referred', 'eligible-not-referred', 'not-indicated', '')),
    oxygen_use VARCHAR(15) NOT NULL DEFAULT '' CHECK (oxygen_use IN ('none', 'long-term', 'ambulatory', '')),
    resting_spo2 INTEGER,
    comorbidities TEXT NOT NULL DEFAULT '',
    self_management_plan VARCHAR(5) NOT NULL DEFAULT '' CHECK (self_management_plan IN ('yes', 'no', '')),
    rescue_pack_supplied VARCHAR(5) NOT NULL DEFAULT '' CHECK (rescue_pack_supplied IN ('yes', 'no', '')),
    next_review_interval TEXT NOT NULL DEFAULT '',
    clinician_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX chronic_obstructive_pulmonary_disease_review_patient_id_idx
    ON chronic_obstructive_pulmonary_disease_review (patient_id);
CREATE INDEX chronic_obstructive_pulmonary_disease_review_clinician_id_idx
    ON chronic_obstructive_pulmonary_disease_review (clinician_id);

CREATE TRIGGER trigger_chronic_obstructive_pulmonary_disease_review_updated_at
    BEFORE UPDATE ON chronic_obstructive_pulmonary_disease_review
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE chronic_obstructive_pulmonary_disease_review IS
    'Main COPD annual-review record (NICE NG115, GOLD 2023+): patient and clinician identification, review context, diagnosis and exposure history, post-bronchodilator spirometry, symptom burden (MRC / mMRC / CAT), exacerbation history, smoking and cessation, inhaler therapy, technique and adherence, vaccinations, pulmonary rehabilitation, oxygen, comorbidities, and self-management plan. The computed GOLD airflow grade, ABE group, review-completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.patient_id IS
    'Foreign key to the patient this review documents (restrict delete).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.clinician_id IS
    'Foreign key to the reviewing clinician (restrict delete); optional.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.clinician_name IS
    'Name of the reviewing clinician as recorded on the review.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.clinician_role IS
    'Reviewing clinician role: gp, practice-nurse, respiratory-nurse, pharmacist, or other.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.reviewed_at IS
    'Date the annual review was conducted.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.review_type IS
    'Type of review: routine-annual, post-exacerbation, or opportunistic.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.patient_identifier IS
    'NHS number or local patient identifier as recorded on the review.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.age_band IS
    'Adult age band: 18-39, 40-59, 60-79, or >=80.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.diagnosis_year IS
    'Year the COPD diagnosis was made.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.spirometry_confirmed IS
    'Whether the COPD diagnosis was confirmed on spirometry (yes/no).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.exposure_notes IS
    'Free-text record of occupational or environmental exposures.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.fev1_litres IS
    'Post-bronchodilator FEV1 in litres.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.fev1_percent_predicted IS
    'Post-bronchodilator FEV1 as a percentage of predicted; drives the GOLD airflow-limitation grade.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.fvc_litres IS
    'Forced vital capacity (FVC) in litres.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.fev1_fvc_ratio IS
    'FEV1/FVC ratio; airflow obstruction is confirmed when < 0.70.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.spirometry_date IS
    'Date the spirometry was performed.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.mrc_grade IS
    'MRC dyspnoea grade (1-5); >= 3 is a pulmonary-rehabilitation trigger.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.mmrc_grade IS
    'mMRC dyspnoea grade (0-4); >= 2 drives the high symptom axis.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.cat_score IS
    'COPD Assessment Test (CAT) total (0-40); >= 10 drives the high symptom axis.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.exacerbations_last_12m IS
    'Count of moderate exacerbations in the past 12 months; >= 2 drives high exacerbation risk.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.hospitalisations_last_12m IS
    'Count of exacerbations needing hospital admission in the past 12 months; >= 1 drives high exacerbation risk.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.last_exacerbation_date IS
    'Date of the most recent exacerbation.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.rescue_pack_courses IS
    'Count of rescue-pack courses used in the past 12 months.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.smoking_status IS
    'Smoking status: current, ex, or never.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.pack_years IS
    'Cumulative smoking exposure in pack-years.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.cessation_support_offered IS
    'Whether brief advice or a stop-smoking referral was offered (yes/no).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.inhaled_therapy IS
    'Free-text record of the current SABA/LABA/LAMA/ICS inhaled regimen.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.device_type IS
    'Free-text record of the inhaler device(s) in use.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.inhaler_technique_checked IS
    'Whether inhaler technique was checked this review (yes/no).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.inhaler_technique_adequate IS
    'Whether inhaler technique was assessed as adequate (yes/no).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.adherence IS
    'Self-reported medication adherence: good, partial, or poor.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.influenza_vaccine IS
    'Influenza vaccination status: up-to-date, due, or declined.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.pneumococcal_vaccine IS
    'Pneumococcal vaccination status: up-to-date, due, or declined.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.covid_vaccine IS
    'COVID-19 vaccination status: up-to-date, due, or declined.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.pulmonary_rehab_status IS
    'Pulmonary-rehabilitation status: completed, referred, eligible-not-referred, or not-indicated.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.oxygen_use IS
    'Home-oxygen use: none, long-term, or ambulatory.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.resting_spo2 IS
    'Resting oxygen saturation (SpO2) on room air, as a percentage.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.comorbidities IS
    'Free-text record of recorded comorbidities.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.self_management_plan IS
    'Whether a personalised self-management plan is in place (yes/no).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.rescue_pack_supplied IS
    'Whether a rescue pack was supplied (yes/no).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.next_review_interval IS
    'Free-text interval (months) to the next scheduled review.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review.clinician_note IS
    'Free-text clinician summary shown in the report.';
