-- Main learning-disability annual-health-check record: one whole-person
-- primary-care review for a person aged 14 or over on the practice's
-- learning-disability register. Holds context and identification, one field
-- per required component (reasonable adjustments and communication, physical
-- health, screening and immunisation uptake, medication review including
-- STOMP, mental health and behaviour, syndrome-specific checks, carer and
-- social), and the Health Action Plan. The completeness grade, the audit
-- trail of fired rules, and the clinical flags live in dedicated child
-- tables. This is a documentation / completeness record: it does not
-- diagnose or grade severity.

CREATE TABLE learning_disability_annual_health_check (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'practice-nurse', 'healthcare-assistant', 'ld-team', 'other', '')),
    checked_on DATE,
    practice_name TEXT NOT NULL DEFAULT '',
    easy_read_invitation_sent VARCHAR(5) NOT NULL DEFAULT '' CHECK (easy_read_invitation_sent IN ('yes', 'no', '')),
    pre_check_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (pre_check_done IN ('yes', 'no', '')),
    person_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('14-17', '18-24', '25-44', '45-64', '65+', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    ld_register_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (ld_register_status IN ('on-register', 'not-on-register', 'newly-added', '')),
    main_carer TEXT NOT NULL DEFAULT '',

    -- Reasonable adjustments and communication
    communication_needs TEXT NOT NULL DEFAULT '',
    reasonable_adjustments_recorded VARCHAR(5) NOT NULL DEFAULT '' CHECK (reasonable_adjustments_recorded IN ('yes', 'no', '')),
    health_passport VARCHAR(15) NOT NULL DEFAULT '' CHECK (health_passport IN ('yes', 'no', 'not-applicable', '')),
    consent_capacity_note TEXT NOT NULL DEFAULT '',

    -- Physical health
    weight_bmi_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (weight_bmi_status IN ('recorded', 'not-recorded', 'declined', '')),
    bmi NUMERIC(4,1),
    blood_pressure_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (blood_pressure_status IN ('normal', 'raised', 'recorded', 'not-recorded', '')),
    epilepsy_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (epilepsy_status IN ('reviewed', 'not-reviewed', 'not-applicable', '')),
    constipation_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (constipation_status IN ('none', 'present', 'not-assessed', '')),
    dysphagia_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (dysphagia_status IN ('none', 'present', 'not-assessed', '')),
    continence_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (continence_status IN ('ok', 'issue', 'not-assessed', '')),
    mobility_falls_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (mobility_falls_status IN ('ok', 'issue', 'not-assessed', '')),
    dental_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (dental_status IN ('ok', 'issue', 'not-assessed', '')),
    vision_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (vision_status IN ('ok', 'issue', 'not-assessed', '')),
    hearing_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (hearing_status IN ('ok', 'issue', 'not-assessed', '')),
    foot_health_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (foot_health_status IN ('ok', 'issue', 'not-assessed', '')),
    skin_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (skin_status IN ('ok', 'issue', 'not-assessed', '')),
    physical_health_actions TEXT NOT NULL DEFAULT '',

    -- Screening and immunisation uptake
    cancer_screening_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (cancer_screening_status IN ('up-to-date', 'declined', 'not-eligible', 'not-recorded', '')),
    other_screening_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (other_screening_status IN ('up-to-date', 'declined', 'not-eligible', 'not-recorded', '')),
    immunisation_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (immunisation_status IN ('up-to-date', 'declined', 'not-recorded', '')),

    -- Medication review and STOMP
    medication_reconciled VARCHAR(5) NOT NULL DEFAULT '' CHECK (medication_reconciled IN ('yes', 'no', '')),
    psychotropic_prescribed VARCHAR(5) NOT NULL DEFAULT '' CHECK (psychotropic_prescribed IN ('yes', 'no', '')),
    psychotropic_indication TEXT NOT NULL DEFAULT '',
    psychotropic_last_reviewed DATE,
    stomp_discussed VARCHAR(15) NOT NULL DEFAULT '' CHECK (stomp_discussed IN ('yes', 'no', 'not-applicable', '')),
    medication_side_effects TEXT NOT NULL DEFAULT '',

    -- Mental health and behaviour
    mental_health_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (mental_health_status IN ('ok', 'concern', 'not-assessed', '')),
    behaviour_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (behaviour_status IN ('none', 'challenging', 'not-assessed', '')),
    behaviour_triggers TEXT NOT NULL DEFAULT '',

    -- Syndrome-specific checks
    syndrome_specific_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (syndrome_specific_status IN ('done', 'not-applicable', 'not-done', '')),

    -- Carer and social
    carer_needs_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (carer_needs_status IN ('assessed', 'not-assessed', 'no-carer', '')),
    social_circumstances TEXT NOT NULL DEFAULT '',

    -- Health Action Plan
    health_action_plan_produced VARCHAR(5) NOT NULL DEFAULT '' CHECK (health_action_plan_produced IN ('yes', 'no', '')),
    health_action_plan_shared VARCHAR(5) NOT NULL DEFAULT '' CHECK (health_action_plan_shared IN ('yes', 'no', '')),
    health_action_plan_actions TEXT NOT NULL DEFAULT '',
    clinician_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX learning_disability_annual_health_check_patient_id_idx
    ON learning_disability_annual_health_check (patient_id);
CREATE INDEX learning_disability_annual_health_check_clinician_id_idx
    ON learning_disability_annual_health_check (clinician_id);

CREATE TRIGGER trigger_learning_disability_annual_health_check_updated_at
    BEFORE UPDATE ON learning_disability_annual_health_check
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE learning_disability_annual_health_check IS
    'Main learning-disability annual-health-check record: context and identification, one field per required component (reasonable adjustments and communication, physical health, screening and immunisation uptake, medication review including STOMP, mental health and behaviour, syndrome-specific checks, carer and social), and the Health Action Plan. Completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN learning_disability_annual_health_check.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN learning_disability_annual_health_check.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN learning_disability_annual_health_check.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN learning_disability_annual_health_check.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN learning_disability_annual_health_check.patient_id IS
    'Foreign key to the patient this check documents (restrict delete).';
COMMENT ON COLUMN learning_disability_annual_health_check.clinician_id IS
    'Foreign key to the clinician who completed the check (restrict delete); optional.';
COMMENT ON COLUMN learning_disability_annual_health_check.clinician_name IS
    'Name of the clinician completing the check.';
COMMENT ON COLUMN learning_disability_annual_health_check.clinician_role IS
    'Role of the clinician completing the check: gp, practice-nurse, healthcare-assistant, ld-team, or other.';
COMMENT ON COLUMN learning_disability_annual_health_check.checked_on IS
    'Date the annual health check was carried out.';
COMMENT ON COLUMN learning_disability_annual_health_check.practice_name IS
    'Name of the GP practice conducting the check.';
COMMENT ON COLUMN learning_disability_annual_health_check.easy_read_invitation_sent IS
    'Whether an easy-read invitation was sent to the person (yes/no).';
COMMENT ON COLUMN learning_disability_annual_health_check.pre_check_done IS
    'Whether a pre-check health questionnaire was completed beforehand (yes/no).';
COMMENT ON COLUMN learning_disability_annual_health_check.person_identifier IS
    'Local identifier for the person.';
COMMENT ON COLUMN learning_disability_annual_health_check.age_band IS
    'Age band of the person: 14-17, 18-24, 25-44, 45-64, or 65+.';
COMMENT ON COLUMN learning_disability_annual_health_check.sex IS
    'Person''s sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN learning_disability_annual_health_check.ld_register_status IS
    'Learning-disability register status: on-register, not-on-register, or newly-added.';
COMMENT ON COLUMN learning_disability_annual_health_check.main_carer IS
    'Main carer or supporter for the person.';
COMMENT ON COLUMN learning_disability_annual_health_check.communication_needs IS
    'Reasonable adjustments and communication needs (free text); required component.';
COMMENT ON COLUMN learning_disability_annual_health_check.reasonable_adjustments_recorded IS
    'Whether reasonable adjustments were recorded (yes/no).';
COMMENT ON COLUMN learning_disability_annual_health_check.health_passport IS
    'Whether a hospital / health passport is in place (yes/no/not-applicable).';
COMMENT ON COLUMN learning_disability_annual_health_check.consent_capacity_note IS
    'Consent and mental-capacity note (free text).';
COMMENT ON COLUMN learning_disability_annual_health_check.weight_bmi_status IS
    'Weight / BMI component status: recorded, not-recorded, or declined.';
COMMENT ON COLUMN learning_disability_annual_health_check.bmi IS
    'Body-mass index (kg/m^2) recorded at the check.';
COMMENT ON COLUMN learning_disability_annual_health_check.blood_pressure_status IS
    'Blood-pressure component status: normal, raised, recorded, or not-recorded.';
COMMENT ON COLUMN learning_disability_annual_health_check.epilepsy_status IS
    'Epilepsy review status: reviewed, not-reviewed, or not-applicable.';
COMMENT ON COLUMN learning_disability_annual_health_check.constipation_status IS
    'Constipation component status: none, present, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.dysphagia_status IS
    'Dysphagia / swallowing component status: none, present, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.continence_status IS
    'Continence component status: ok, issue, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.mobility_falls_status IS
    'Mobility and falls component status: ok, issue, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.dental_status IS
    'Dental / oral-health component status: ok, issue, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.vision_status IS
    'Vision component status: ok, issue, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.hearing_status IS
    'Hearing component status: ok, issue, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.foot_health_status IS
    'Foot-health component status: ok, issue, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.skin_status IS
    'Skin component status: ok, issue, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.physical_health_actions IS
    'Actions arising from the physical-health review (free text).';
COMMENT ON COLUMN learning_disability_annual_health_check.cancer_screening_status IS
    'National cancer-screening uptake status: up-to-date, declined, not-eligible, or not-recorded.';
COMMENT ON COLUMN learning_disability_annual_health_check.other_screening_status IS
    'Other screening uptake status: up-to-date, declined, not-eligible, or not-recorded.';
COMMENT ON COLUMN learning_disability_annual_health_check.immunisation_status IS
    'Immunisation uptake status: up-to-date, declined, or not-recorded.';
COMMENT ON COLUMN learning_disability_annual_health_check.medication_reconciled IS
    'Whether the medication list was reconciled at the check (yes/no).';
COMMENT ON COLUMN learning_disability_annual_health_check.psychotropic_prescribed IS
    'Whether a psychotropic medicine is prescribed (yes/no); drives the STOMP flag.';
COMMENT ON COLUMN learning_disability_annual_health_check.psychotropic_indication IS
    'Documented indication for the psychotropic medicine (free text).';
COMMENT ON COLUMN learning_disability_annual_health_check.psychotropic_last_reviewed IS
    'Date the psychotropic medicine was last reviewed.';
COMMENT ON COLUMN learning_disability_annual_health_check.stomp_discussed IS
    'Whether STOMP was discussed (yes/no/not-applicable).';
COMMENT ON COLUMN learning_disability_annual_health_check.medication_side_effects IS
    'Side effects reviewed at the medication review (free text).';
COMMENT ON COLUMN learning_disability_annual_health_check.mental_health_status IS
    'Mental-health component status: ok, concern, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.behaviour_status IS
    'Behaviour component status: none, challenging, or not-assessed.';
COMMENT ON COLUMN learning_disability_annual_health_check.behaviour_triggers IS
    'Triggers for behaviour that challenges (free text).';
COMMENT ON COLUMN learning_disability_annual_health_check.syndrome_specific_status IS
    'Syndrome-specific check status: done, not-applicable, or not-done.';
COMMENT ON COLUMN learning_disability_annual_health_check.carer_needs_status IS
    'Carer-needs component status: assessed, not-assessed, or no-carer.';
COMMENT ON COLUMN learning_disability_annual_health_check.social_circumstances IS
    'Social circumstances, day activity, and employment (free text).';
COMMENT ON COLUMN learning_disability_annual_health_check.health_action_plan_produced IS
    'Whether a Health Action Plan was produced (yes/no); required output.';
COMMENT ON COLUMN learning_disability_annual_health_check.health_action_plan_shared IS
    'Whether the Health Action Plan was shared with the person and carer (yes/no).';
COMMENT ON COLUMN learning_disability_annual_health_check.health_action_plan_actions IS
    'Collated Health Action Plan actions (free text).';
COMMENT ON COLUMN learning_disability_annual_health_check.clinician_note IS
    'Free-text summary note for the check.';
