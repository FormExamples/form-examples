-- Main C-SSRS assessment record: assessment context, patient
-- identification, the five ordinal suicidal-ideation items (Q1-Q5), the
-- optional ideation-intensity sub-items, the categorical suicidal-behaviour
-- items with recency and lifetime count, and the lethality and means
-- inputs. The computed risk classification, fired rules, and flags live in
-- dedicated child tables.

CREATE TABLE columbia_suicide_severity_rating_scale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('clinician', 'nurse', 'mental-health-practitioner', 'crisis-worker', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('mental-health', 'emergency-department', 'primary-care', 'crisis-service', 'inpatient', 'other', '')),
    scale_version VARCHAR(10) NOT NULL DEFAULT '' CHECK (scale_version IN ('screener', 'full', '')),
    reason_for_assessment TEXT NOT NULL DEFAULT '',

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_band IN ('adolescent', 'adult', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: suicidal ideation (Q1-Q5, each yes/no; highest affirmative sets the level)
    wish_to_be_dead VARCHAR(5) NOT NULL DEFAULT '' CHECK (wish_to_be_dead IN ('yes', 'no', '')),
    non_specific_active_thoughts VARCHAR(5) NOT NULL DEFAULT '' CHECK (non_specific_active_thoughts IN ('yes', 'no', '')),
    active_ideation_methods VARCHAR(5) NOT NULL DEFAULT '' CHECK (active_ideation_methods IN ('yes', 'no', '')),
    active_ideation_intent VARCHAR(5) NOT NULL DEFAULT '' CHECK (active_ideation_intent IN ('yes', 'no', '')),
    active_ideation_plan VARCHAR(5) NOT NULL DEFAULT '' CHECK (active_ideation_plan IN ('yes', 'no', '')),
    ideation_timeframe VARCHAR(20) NOT NULL DEFAULT '' CHECK (ideation_timeframe IN ('past-month', 'lifetime-worst', '')),

    -- Step 4: ideation intensity (optional; full version only) — ordinals 0-5
    ideation_frequency INT CHECK (ideation_frequency BETWEEN 0 AND 5),
    ideation_duration INT CHECK (ideation_duration BETWEEN 0 AND 5),
    ideation_controllability INT CHECK (ideation_controllability BETWEEN 0 AND 5),
    ideation_deterrents INT CHECK (ideation_deterrents BETWEEN 0 AND 5),
    ideation_reasons INT CHECK (ideation_reasons BETWEEN 0 AND 5),

    -- Step 5: suicidal behaviour (each yes/no) and recency
    actual_attempt VARCHAR(5) NOT NULL DEFAULT '' CHECK (actual_attempt IN ('yes', 'no', '')),
    interrupted_attempt VARCHAR(5) NOT NULL DEFAULT '' CHECK (interrupted_attempt IN ('yes', 'no', '')),
    aborted_attempt VARCHAR(5) NOT NULL DEFAULT '' CHECK (aborted_attempt IN ('yes', 'no', '')),
    preparatory_acts VARCHAR(5) NOT NULL DEFAULT '' CHECK (preparatory_acts IN ('yes', 'no', '')),
    non_suicidal_self_injury VARCHAR(5) NOT NULL DEFAULT '' CHECK (non_suicidal_self_injury IN ('yes', 'no', '')),
    behaviour_recency VARCHAR(20) NOT NULL DEFAULT '' CHECK (behaviour_recency IN ('within-3-months', 'over-3-months', '')),
    lifetime_attempt_count INT CHECK (lifetime_attempt_count >= 0),
    most_recent_attempt_date DATE,

    -- Step 6: lethality — actual 0-5; potential 0-2 (coded only when actual is 0)
    actual_lethality INT CHECK (actual_lethality BETWEEN 0 AND 5),
    potential_lethality INT CHECK (potential_lethality BETWEEN 0 AND 2),

    -- Step 7: means and protective factors
    access_to_lethal_means VARCHAR(10) NOT NULL DEFAULT '' CHECK (access_to_lethal_means IN ('yes', 'no', 'unknown', '')),
    protective_factors TEXT NOT NULL DEFAULT '',

    -- Step 8: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX columbia_suicide_severity_rating_scale_patient_id_idx
    ON columbia_suicide_severity_rating_scale (patient_id);
CREATE INDEX columbia_suicide_severity_rating_scale_clinician_id_idx
    ON columbia_suicide_severity_rating_scale (clinician_id);

CREATE TRIGGER trigger_columbia_suicide_severity_rating_scale_updated_at
    BEFORE UPDATE ON columbia_suicide_severity_rating_scale
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE columbia_suicide_severity_rating_scale IS
    'Main C-SSRS assessment record: context, patient identification, the five ordinal ideation items, optional ideation-intensity sub-items, categorical behaviour items with recency, and lethality and means inputs.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.clinician_role IS
    'Role of the assessing clinician: clinician, nurse, mental-health-practitioner, crisis-worker, or other.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.care_setting IS
    'Care setting: mental-health, emergency-department, primary-care, crisis-service, inpatient, or other.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.scale_version IS
    'C-SSRS version used: screener (triage) or full (clinical).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.reason_for_assessment IS
    'Free-text trigger or reason for performing the screen.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.age_band IS
    'Age band: adolescent or adult.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.wish_to_be_dead IS
    'Ideation Q1 (level 1) — passive wish to be dead (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.non_specific_active_thoughts IS
    'Ideation Q2 (level 2) — non-specific active suicidal thoughts, no method, intent, or plan (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.active_ideation_methods IS
    'Ideation Q3 (level 3) — active ideation with any methods but no specific plan or intent (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.active_ideation_intent IS
    'Ideation Q4 (level 4) — active ideation with some intent to act, without a fully worked-out plan (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.active_ideation_plan IS
    'Ideation Q5 (level 5) — active ideation with a specific plan and intent to act (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.ideation_timeframe IS
    'Reference timeframe for the ideation items: past-month or lifetime-worst.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.ideation_frequency IS
    'Ideation-intensity sub-item (0-5) — frequency of the most severe ideation; full version only.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.ideation_duration IS
    'Ideation-intensity sub-item (0-5) — duration of the most severe ideation; full version only.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.ideation_controllability IS
    'Ideation-intensity sub-item (0-5) — controllability of the most severe ideation; full version only.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.ideation_deterrents IS
    'Ideation-intensity sub-item (0-5) — deterrents against acting on the ideation; full version only.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.ideation_reasons IS
    'Ideation-intensity sub-item (0-5) — reasons for the ideation; full version only.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.actual_attempt IS
    'Suicidal behaviour — actual attempt, a potentially self-injurious act with at least some intent to die (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.interrupted_attempt IS
    'Suicidal behaviour — interrupted attempt, stopped by an outside circumstance before self-harm begins (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.aborted_attempt IS
    'Suicidal behaviour — aborted or self-interrupted attempt, the person stops before beginning the act (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.preparatory_acts IS
    'Suicidal behaviour — preparatory acts or behaviour, e.g. acquiring means or writing a note (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.non_suicidal_self_injury IS
    'Non-suicidal self-injury (NSSI) — self-injury without intent to die; tracked separately and does not count as suicidal behaviour (yes/no).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.behaviour_recency IS
    'Recency of the most recent suicidal behaviour: within-3-months or over-3-months (lifetime).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.lifetime_attempt_count IS
    'Total number of lifetime actual attempts.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.most_recent_attempt_date IS
    'Date of the most recent actual attempt.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.actual_lethality IS
    'Actual lethality / medical damage of the most recent actual attempt, ordinal 0-5 (0 = no physical damage, 5 = death).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.potential_lethality IS
    'Potential lethality, ordinal 0-2, coded only when actual lethality is 0.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.access_to_lethal_means IS
    'Access to lethal means: yes, no, or unknown.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.protective_factors IS
    'Free-text note describing protective factors.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
