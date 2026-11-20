-- Main ReSPECT record: one personalised emergency care and treatment plan
-- created through shared decision-making. Records the person's summary of
-- relevant health, their preferences and what matters, agreed clinical
-- recommendations, an explicit CPR recommendation, agreed ceilings of
-- treatment, a record of capacity and involvement, and clinician sign-off.
-- The completeness grade, the audit trail of fired mandatory rules, and the
-- safety / governance flags live in dedicated child tables. Presence of a
-- component is detected by a non-empty field, not by semantic analysis.
--
-- The short base name `respect` is used for this form's tables, columns,
-- indexes, and triggers because the full slug
-- (recommended_summary_plan_for_emergency_care_and_treatment) would exceed
-- PostgreSQL's 63-byte identifier limit for derived index and trigger names.

CREATE TABLE recommended_summary_plan_for_emergency_care_and_treatment.respect (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES recommended_summary_plan_for_emergency_care_and_treatment.patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES recommended_summary_plan_for_emergency_care_and_treatment.clinician(id) ON DELETE RESTRICT,

    -- Personal details
    person_name TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    identifier TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    key_contact TEXT NOT NULL DEFAULT '',

    -- Summary of relevant health
    health_summary TEXT NOT NULL DEFAULT '',
    diagnoses TEXT NOT NULL DEFAULT '',
    existing_documents TEXT NOT NULL DEFAULT '',

    -- Preferences and what matters
    what_matters TEXT NOT NULL DEFAULT '',
    care_preferences TEXT NOT NULL DEFAULT '',

    -- Clinical recommendations
    priority_balance VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (priority_balance IN ('sustain-life', 'balanced', 'comfort', '')),
    recommended_interventions TEXT NOT NULL DEFAULT '',
    not_recommended_interventions TEXT NOT NULL DEFAULT '',

    -- CPR recommendation
    cpr_recommendation VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (cpr_recommendation IN ('attempt', 'do-not-attempt', '')),
    cpr_rationale TEXT NOT NULL DEFAULT '',
    cpr_discussed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (cpr_discussed IN ('yes', 'no', '')),

    -- Ceilings of treatment
    hospital_transfer VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (hospital_transfer IN ('appropriate', 'not-appropriate', '')),
    critical_care_admission VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (critical_care_admission IN ('appropriate', 'not-appropriate', '')),
    treatment_ceilings TEXT NOT NULL DEFAULT '',

    -- Capacity and involvement
    has_capacity VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (has_capacity IN ('yes', 'no', '')),
    capacity_assessment TEXT NOT NULL DEFAULT '',
    involvement VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (involvement IN ('person', 'legal-proxy', 'consultees', '')),
    proxy_details TEXT NOT NULL DEFAULT '',

    -- Clinician sign-off
    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (clinician_role IN ('doctor', 'nurse', 'paramedic', 'other', '')),
    clinician_registration TEXT NOT NULL DEFAULT '',
    signature TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    senior_endorsement TEXT NOT NULL DEFAULT '',
    emergency_contacts TEXT NOT NULL DEFAULT '',
    review_date DATE
);

CREATE INDEX respect_patient_id_idx
    ON recommended_summary_plan_for_emergency_care_and_treatment.respect (patient_id);
CREATE INDEX respect_clinician_id_idx
    ON recommended_summary_plan_for_emergency_care_and_treatment.respect (clinician_id);
CREATE INDEX respect_person_name_trgm_idx
    ON recommended_summary_plan_for_emergency_care_and_treatment.respect
    USING GIN (person_name gin_trgm_ops);

CREATE TRIGGER trigger_respect_updated_at
    BEFORE UPDATE ON recommended_summary_plan_for_emergency_care_and_treatment.respect
    FOR EACH ROW
    EXECUTE FUNCTION recommended_summary_plan_for_emergency_care_and_treatment.set_updated_at();

COMMENT ON TABLE recommended_summary_plan_for_emergency_care_and_treatment.respect IS
    'Main ReSPECT record: one personalised emergency care and treatment plan created through shared decision-making, covering the person''s summary of health, preferences, agreed clinical recommendations, CPR recommendation, ceilings of treatment, capacity and involvement, and clinician sign-off. Completeness grade, fired rules, and flags live in child tables. The short base name `respect` is used because the full slug would exceed PostgreSQL''s 63-byte identifier limit.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.patient_id IS
    'Foreign key to the patient this plan is about (restrict delete).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.clinician_id IS
    'Foreign key to the clinician who completed and signed the plan (restrict delete); optional.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.person_name IS
    'Personal details: name of the person the plan is about.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.date_of_birth IS
    'Personal details: the person''s date of birth.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.identifier IS
    'Personal details: NHS / CHI number or local identifier.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.address IS
    'Personal details: usual residence.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.key_contact IS
    'Personal details: key contact / next-of-kin details.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.health_summary IS
    'Summary of relevant health: brief clinical summary (mandatory content).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.diagnoses IS
    'Summary of relevant health: relevant diagnoses.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.existing_documents IS
    'Summary of relevant health: existing documents such as ADRT, LPA, or organ-donation wishes.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.what_matters IS
    'Preferences: the person''s values, priorities, and fears.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.care_preferences IS
    'Preferences: the person''s preferences for care.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.priority_balance IS
    'Clinical recommendations: balance of priorities from life-sustaining to comfort (sustain-life, balanced, or comfort).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.recommended_interventions IS
    'Clinical recommendations: interventions recommended.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.not_recommended_interventions IS
    'Clinical recommendations: interventions not recommended.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.cpr_recommendation IS
    'CPR recommendation: attempt CPR, do-not-attempt CPR, or empty when undocumented (the most safety-critical field).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.cpr_rationale IS
    'CPR recommendation: clinical rationale for the recommendation.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.cpr_discussed IS
    'CPR recommendation: whether the recommendation was discussed with the person or their proxy (yes/no).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.hospital_transfer IS
    'Ceilings of treatment: whether hospital transfer is appropriate or not-appropriate.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.critical_care_admission IS
    'Ceilings of treatment: whether critical-care admission is appropriate or not-appropriate.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.treatment_ceilings IS
    'Ceilings of treatment: other agreed limits on treatment.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.has_capacity IS
    'Capacity and involvement: whether the person has capacity for this decision (yes/no); drives the conditional capacity rule.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.capacity_assessment IS
    'Capacity and involvement: assessment recorded where the person lacks capacity (Mental Capacity Act 2005).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.involvement IS
    'Capacity and involvement: who was involved in the decision (person, legal-proxy, or consultees).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.proxy_details IS
    'Capacity and involvement: welfare attorney, deputy, or consultee details.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.clinician_name IS
    'Clinician sign-off: name of the completing clinician.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.clinician_role IS
    'Clinician sign-off: role of the completing clinician (doctor, nurse, paramedic, or other).';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.clinician_registration IS
    'Clinician sign-off: GMC / NMC / HCPC registration number.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.signature IS
    'Clinician sign-off: electronic signature; required for the plan to be valid.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.signed_at IS
    'Clinician sign-off: date and time the plan was signed.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.senior_endorsement IS
    'Clinician sign-off: senior clinician endorsement.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.emergency_contacts IS
    'Clinician sign-off: emergency contacts.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.respect.review_date IS
    'Clinician sign-off: planned review date; drives the review-date-passed flag.';
