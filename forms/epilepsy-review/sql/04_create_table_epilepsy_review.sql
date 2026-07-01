-- Main epilepsy annual-review record: one UK primary-care annual review
-- (NICE NG217) documenting the position since the last review across the
-- epilepsy profile, seizures and anti-seizure medication (ASM), triggers,
-- SUDEP discussion, injuries and status epilepticus, safety (DVLA driving,
-- bathing, occupation), valproate and pregnancy-prevention arrangements for
-- women of childbearing potential, mental health, and the care plan, plus
-- patient / clinician identification and review context. The computed
-- seizure-control classification, completeness grade, the audit trail of
-- fired rules, and the safety flags live in dedicated child tables. This is a
-- documentation and decision-support record, not a numeric score, a
-- diagnostic test, or a prescribing instrument.

CREATE TABLE epilepsy_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and profile
    reviewer_name TEXT NOT NULL DEFAULT '',
    reviewer_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (reviewer_role IN ('gp', 'practice-nurse', 'epilepsy-nurse', 'neurologist', 'other', '')),
    reviewed_at DATE,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'epilepsy-clinic', 'community', 'other', '')),
    review_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (review_type IN ('annual', 'interim', '')),
    months_since_last_review NUMERIC(5,1),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-59', '60-79', '>=80', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    epilepsy_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (epilepsy_type IN ('focal', 'generalised', 'combined', 'unknown', '')),
    age_at_onset NUMERIC(4,1),
    years_since_diagnosis NUMERIC(4,1),
    learning_disability VARCHAR(5) NOT NULL DEFAULT '' CHECK (learning_disability IN ('yes', 'no', '')),

    -- Seizures and medication
    seizure_types TEXT NOT NULL DEFAULT '',
    seizure_frequency VARCHAR(20) NOT NULL DEFAULT '' CHECK (seizure_frequency IN ('none', 'less-than-monthly', 'monthly', 'weekly', 'daily', '')),
    last_seizure_date DATE,
    seizure_free_months NUMERIC(5,1),
    seizure_trend VARCHAR(15) NOT NULL DEFAULT '' CHECK (seizure_trend IN ('seizure-free', 'decreasing', 'stable', 'increasing', '')),
    current_asms TEXT NOT NULL DEFAULT '',
    asm_adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (asm_adherence IN ('good', 'partial', 'poor', '')),
    asm_side_effects VARCHAR(15) NOT NULL DEFAULT '' CHECK (asm_side_effects IN ('none', 'mild', 'significant', '')),
    drug_level NUMERIC(6,1),

    -- Risk, safety and review domains
    triggers TEXT NOT NULL DEFAULT '',
    sudep_discussed VARCHAR(5) NOT NULL DEFAULT '' CHECK (sudep_discussed IN ('yes', 'no', '')),
    status_epilepticus VARCHAR(5) NOT NULL DEFAULT '' CHECK (status_epilepticus IN ('yes', 'no', '')),
    seizure_injury VARCHAR(5) NOT NULL DEFAULT '' CHECK (seizure_injury IN ('yes', 'no', '')),
    dvla_eligible VARCHAR(15) NOT NULL DEFAULT '' CHECK (dvla_eligible IN ('eligible', 'not-eligible', 'not-applicable', '')),
    currently_driving VARCHAR(5) NOT NULL DEFAULT '' CHECK (currently_driving IN ('yes', 'no', '')),
    bathing_advice_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (bathing_advice_given IN ('yes', 'no', '')),
    woman_of_childbearing_potential VARCHAR(15) NOT NULL DEFAULT '' CHECK (woman_of_childbearing_potential IN ('yes', 'no', 'not-applicable', '')),
    on_valproate VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_valproate IN ('yes', 'no', '')),
    pregnancy_prevention_programme VARCHAR(15) NOT NULL DEFAULT '' CHECK (pregnancy_prevention_programme IN ('in-place', 'not-in-place', 'not-applicable', '')),
    folic_acid VARCHAR(15) NOT NULL DEFAULT '' CHECK (folic_acid IN ('yes', 'no', 'not-applicable', '')),
    contraception_interaction_reviewed VARCHAR(15) NOT NULL DEFAULT '' CHECK (contraception_interaction_reviewed IN ('yes', 'no', 'not-applicable', '')),
    mental_health_concern VARCHAR(15) NOT NULL DEFAULT '' CHECK (mental_health_concern IN ('none', 'low-mood', 'anxiety', 'depression', 'suicidality', '')),
    specialist_review_needed VARCHAR(5) NOT NULL DEFAULT '' CHECK (specialist_review_needed IN ('yes', 'no', '')),
    next_review_due DATE,

    -- Care plan and free-text context
    care_plan TEXT NOT NULL DEFAULT '',
    review_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX epilepsy_review_patient_id_idx
    ON epilepsy_review (patient_id);
CREATE INDEX epilepsy_review_clinician_id_idx
    ON epilepsy_review (clinician_id);

CREATE TRIGGER trigger_epilepsy_review_updated_at
    BEFORE UPDATE ON epilepsy_review
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE epilepsy_review IS
    'Main epilepsy annual-review record (NICE NG217): patient and clinician identification, review context, epilepsy profile, seizures and anti-seizure medication with adherence and side effects, triggers, SUDEP discussion, injuries and status epilepticus, safety (DVLA driving, bathing, occupation), valproate and pregnancy-prevention arrangements, mental health, and the care plan. The computed seizure-control classification, completeness grade, fired rules, and safety flags live in child tables.';
COMMENT ON COLUMN epilepsy_review.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN epilepsy_review.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN epilepsy_review.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN epilepsy_review.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN epilepsy_review.patient_id IS
    'Foreign key to the patient this review documents (restrict delete).';
COMMENT ON COLUMN epilepsy_review.clinician_id IS
    'Foreign key to the reviewing clinician (restrict delete); optional.';
COMMENT ON COLUMN epilepsy_review.reviewer_name IS
    'Name of the reviewing clinician as recorded on the review.';
COMMENT ON COLUMN epilepsy_review.reviewer_role IS
    'Reviewing clinician role: gp, practice-nurse, epilepsy-nurse, neurologist, or other.';
COMMENT ON COLUMN epilepsy_review.reviewed_at IS
    'Date the annual review was conducted.';
COMMENT ON COLUMN epilepsy_review.care_setting IS
    'Care setting where the review was conducted: general-practice, epilepsy-clinic, community, or other.';
COMMENT ON COLUMN epilepsy_review.review_type IS
    'Type of review: annual or interim.';
COMMENT ON COLUMN epilepsy_review.months_since_last_review IS
    'Interval in months since the last review; drives the review-overdue flag when greater than 12.';
COMMENT ON COLUMN epilepsy_review.patient_identifier IS
    'NHS number or local patient identifier as recorded on the review.';
COMMENT ON COLUMN epilepsy_review.age_band IS
    'Adult age band: 18-39, 40-59, 60-79, or >=80.';
COMMENT ON COLUMN epilepsy_review.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN epilepsy_review.epilepsy_type IS
    'Epilepsy type: focal, generalised, combined, or unknown.';
COMMENT ON COLUMN epilepsy_review.age_at_onset IS
    'Age at epilepsy onset in years.';
COMMENT ON COLUMN epilepsy_review.years_since_diagnosis IS
    'Years since epilepsy diagnosis.';
COMMENT ON COLUMN epilepsy_review.learning_disability IS
    'Whether the patient has a learning disability (yes/no).';
COMMENT ON COLUMN epilepsy_review.seizure_types IS
    'Free-text record of the seizure type(s) present.';
COMMENT ON COLUMN epilepsy_review.seizure_frequency IS
    'Seizure frequency: none, less-than-monthly, monthly, weekly, or daily (weekly/daily drive an uncontrolled classification).';
COMMENT ON COLUMN epilepsy_review.last_seizure_date IS
    'Date of the most recent seizure.';
COMMENT ON COLUMN epilepsy_review.seizure_free_months IS
    'Documented seizure-free duration in months.';
COMMENT ON COLUMN epilepsy_review.seizure_trend IS
    'Seizure trend since the last review: seizure-free, decreasing, stable, or increasing (increasing drives an uncontrolled classification).';
COMMENT ON COLUMN epilepsy_review.current_asms IS
    'Free-text record of current anti-seizure medication(s) and doses.';
COMMENT ON COLUMN epilepsy_review.asm_adherence IS
    'Self-reported ASM adherence: good, partial, or poor (poor drives an adherence flag).';
COMMENT ON COLUMN epilepsy_review.asm_side_effects IS
    'ASM side-effect burden: none, mild, or significant (significant drives a side-effects flag).';
COMMENT ON COLUMN epilepsy_review.drug_level IS
    'Therapeutic ASM drug level where relevant (units per the specific drug).';
COMMENT ON COLUMN epilepsy_review.triggers IS
    'Free-text record of reported seizure triggers.';
COMMENT ON COLUMN epilepsy_review.sudep_discussed IS
    'Whether Sudden Unexpected Death in Epilepsy (SUDEP) risk was discussed (yes/no); a non-yes value drives a SUDEP-not-documented flag.';
COMMENT ON COLUMN epilepsy_review.status_epilepticus IS
    'Whether status epilepticus occurred since the last review (yes/no); yes drives an uncontrolled classification and a high-priority flag.';
COMMENT ON COLUMN epilepsy_review.seizure_injury IS
    'Whether a seizure-related injury occurred since the last review (yes/no).';
COMMENT ON COLUMN epilepsy_review.dvla_eligible IS
    'DVLA driving eligibility: eligible, not-eligible, or not-applicable.';
COMMENT ON COLUMN epilepsy_review.currently_driving IS
    'Whether the patient is currently driving (yes/no); driving while not DVLA-eligible drives a driving-safety flag.';
COMMENT ON COLUMN epilepsy_review.bathing_advice_given IS
    'Whether bathing / showering safety advice was given (yes/no).';
COMMENT ON COLUMN epilepsy_review.woman_of_childbearing_potential IS
    'Whether the patient is a woman of childbearing potential (yes/no/not-applicable); when yes, the valproate/PPP, folic-acid, and contraception domains become required for completeness.';
COMMENT ON COLUMN epilepsy_review.on_valproate IS
    'Whether the patient is prescribed sodium valproate (yes/no).';
COMMENT ON COLUMN epilepsy_review.pregnancy_prevention_programme IS
    'Valproate Pregnancy Prevention Programme status: in-place, not-in-place, or not-applicable.';
COMMENT ON COLUMN epilepsy_review.folic_acid IS
    'Whether folic acid is prescribed: yes, no, or not-applicable.';
COMMENT ON COLUMN epilepsy_review.contraception_interaction_reviewed IS
    'Whether contraception and ASM interactions were reviewed: yes, no, or not-applicable.';
COMMENT ON COLUMN epilepsy_review.mental_health_concern IS
    'Mental-health concern: none, low-mood, anxiety, depression, or suicidality (suicidality high priority; depression/anxiety/low-mood medium).';
COMMENT ON COLUMN epilepsy_review.specialist_review_needed IS
    'Whether specialist (neurology) review is needed (yes/no).';
COMMENT ON COLUMN epilepsy_review.next_review_due IS
    'Date the next review is planned.';
COMMENT ON COLUMN epilepsy_review.care_plan IS
    'Free-text record of the agreed epilepsy care plan.';
COMMENT ON COLUMN epilepsy_review.review_context IS
    'Optional free-text review context or narrative shown in the summary.';
